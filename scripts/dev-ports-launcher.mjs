import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const NEXT_ENTRYPOINT = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));

/**
 * Single-app launcher. Keeps the same `buildDevCommand` shape as NexMenu so
 * `worktree:init` / docs that mention the ports launcher remain accurate, but
 * only one target is needed for this repo.
 */
export function buildDevCommand(target, port, passthrough = []) {
  const normalized = target === 'app' ? 'frontend' : target;
  if (normalized === 'frontend') {
    return {
      command: process.execPath,
      args: [NEXT_ENTRYPOINT, 'dev', '--port', String(port), ...passthrough],
    };
  }
  throw new Error(`Unknown dev target: ${target} (expected 'frontend' or 'app')`);
}

export function buildSpawnOptions(environment = process.env) {
  return { env: environment, stdio: 'inherit' };
}

export function parseArguments(args) {
  const [target, ...passthrough] = args;
  return { target, passthrough };
}

function terminateChild(child) {
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
    return;
  }
  child.kill('SIGTERM');
}

function run(target, passthrough) {
  if (target !== 'frontend' && target !== 'app') {
    console.error('Usage: node scripts/dev-ports-launcher.mjs <frontend|app> [-- <next args>]');
    process.exit(1);
  }
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const { command, args } = buildDevCommand(target, port, passthrough);
  const child = spawn(command, args, buildSpawnOptions(process.env));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => terminateChild(child));
  child.on('error', (error) => {
    console.error(`Failed to start ${target} dev server: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { target, passthrough } = parseArguments(process.argv.slice(2));
  if (!target || (target !== 'frontend' && target !== 'app')) {
    console.error('Usage: node scripts/dev-ports-launcher.mjs <frontend|app> [-- <next args>]');
    process.exit(1);
  }
  run(target, passthrough);
}
