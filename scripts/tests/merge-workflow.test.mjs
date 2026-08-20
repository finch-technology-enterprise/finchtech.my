import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';

const repositoryRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const prePushHook = join(repositoryRoot, '.husky', 'pre-push');
const mergeLocalScript = join(repositoryRoot, 'scripts', 'merge-local.sh');

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function command(cwd, file, args) {
  return spawnSync(file, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function createRepository() {
  const root = mkdtempSync(join(tmpdir(), 'finchtech-merge-workflow-'));
  const remote = join(root, 'remote.git');
  const repository = join(root, 'repository');

  git(root, ['init', '--bare', remote]);
  git(root, ['init', '-b', 'production', repository]);
  git(repository, ['config', 'user.name', 'Finch Technology']);
  git(repository, ['config', 'user.email', 'admin@finchtech.my']);
  git(repository, ['config', 'core.hooksPath', '.husky']);
  writeFileSync(join(repository, '.gitignore'), '');
  writeFileSync(join(repository, 'state.txt'), 'base\n');
  git(repository, ['add', '.']);
  git(repository, ['commit', '-m', 'chore: initialize test repository']);
  git(repository, ['remote', 'add', 'origin', remote]);
  git(repository, ['push', 'origin', 'production']);
  git(repository, ['fetch', 'origin']);

  const hooks = join(repository, '.husky');
  mkdirSync(hooks);
  cpSync(prePushHook, join(hooks, 'pre-push'));
  chmodSync(join(hooks, 'pre-push'), 0o755);

  return { root, remote, repository };
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

function createFeature(repository, branch = 'feature/example') {
  git(repository, ['switch', '-c', branch]);
  writeFileSync(join(repository, 'state.txt'), 'feature\n');
  git(repository, ['add', 'state.txt']);
  git(repository, ['commit', '-m', 'feat: add feature change']);
  return branch;
}

test('pre-push accepts one Finch-authored local merge commit to production', () => {
  const { root, repository } = createRepository();
  try {
    createFeature(repository);
    git(repository, ['switch', 'production']);
    git(repository, ['merge', '--no-ff', '--no-edit', 'feature/example']);
    const result = command(repository, 'git', ['push', 'origin', 'production']);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(repository, ['show', '-s', '--format=%an <%ae>', 'HEAD']).trim(), 'Finch Technology <admin@finchtech.my>');
    assert.equal(git(repository, ['rev-list', '--count', 'HEAD^@']), '2\n');
  } finally {
    cleanup(root);
  }
});

test('pre-push rejects a direct Finch-authored production commit', () => {
  const { root, repository } = createRepository();
  try {
    writeFileSync(join(repository, 'state.txt'), 'direct\n');
    git(repository, ['add', 'state.txt']);
    git(repository, ['commit', '-m', 'fix: direct production change']);
    const result = command(repository, 'git', ['push', 'origin', 'production']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /local merge commit/);
  } finally {
    cleanup(root);
  }
});

test('pre-push rejects a feature refspec targeting production', () => {
  const { root, repository } = createRepository();
  try {
    createFeature(repository);
    const result = command(repository, 'git', ['push', 'origin', 'HEAD:refs/heads/production']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /destination refs\/heads\/production/);
  } finally {
    cleanup(root);
  }
});

test('pre-push rejects a spoofed Dependabot author', () => {
  const { root, repository } = createRepository();
  try {
    createFeature(repository);
    git(repository, ['commit', '--allow-empty', '--author', 'dependabot[bot] <attacker@example.com>', '-m', 'chore: spoof bot']);
    const result = command(repository, 'git', ['push', 'origin', 'feature/example']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Finch Technology/);
  } finally {
    cleanup(root);
  }
});

test('merge:local creates and pushes exactly one Finch-authored merge commit', () => {
  const { root, remote, repository } = createRepository();
  try {
    const branch = createFeature(repository, 'feature/local-merge');
    git(repository, ['push', 'origin', branch]);
    const reviewedSha = git(repository, ['rev-parse', 'HEAD']).trim();
    git(repository, ['switch', 'production']);
    const updateLog = join(remote, 'update.log');
    writeFileSync(join(remote, 'hooks', 'update'), '#!/bin/sh\nprintf "%s\\n" "$1" >> "$(git rev-parse --git-dir)/update.log"\n');
    chmodSync(join(remote, 'hooks', 'update'), 0o755);
    const scripts = join(repository, 'scripts');
    mkdirSync(scripts);
    cpSync(mergeLocalScript, join(scripts, 'merge-local.sh'));
    chmodSync(join(scripts, 'merge-local.sh'), 0o755);
    const result = command(repository, 'sh', ['./scripts/merge-local.sh', branch, reviewedSha]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(updateLog, 'utf8').trim(), 'refs/heads/production');
    assert.equal(git(repository, ['rev-list', '--count', 'origin/production..HEAD']), '0\n');
    assert.equal(git(repository, ['show', '-s', '--format=%an <%ae>', 'HEAD']).trim(), 'Finch Technology <admin@finchtech.my>');
    assert.equal(git(repository, ['rev-list', '--count', 'HEAD^@']), '2\n');
  } finally {
    cleanup(root);
  }
});

test('merge:local accepts permitted dependency branch names', () => {
  const { root, repository } = createRepository();
  try {
    const branch = createFeature(repository, 'dependabot/example');
    git(repository, ['commit', '--allow-empty', '--author', 'dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>', '-m', 'chore: dependency update']);
    git(repository, ['push', 'origin', branch]);
    const reviewedSha = git(repository, ['rev-parse', 'HEAD']).trim();
    git(repository, ['switch', 'production']);
    const scripts = join(repository, 'scripts');
    mkdirSync(scripts);
    cpSync(mergeLocalScript, join(scripts, 'merge-local.sh'));
    chmodSync(join(scripts, 'merge-local.sh'), 0o755);
    const result = command(repository, 'sh', ['./scripts/merge-local.sh', branch, reviewedSha]);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    cleanup(root);
  }
});

test('merge:local rejects a branch updated after review', () => {
  const { root, repository } = createRepository();
  try {
    const branch = createFeature(repository, 'feature/reviewed-head');
    git(repository, ['push', 'origin', branch]);
    const reviewedSha = git(repository, ['rev-parse', 'HEAD']).trim();
    writeFileSync(join(repository, 'state.txt'), 'unreviewed\n');
    git(repository, ['add', 'state.txt']);
    git(repository, ['commit', '-m', 'fix: add unreviewed change']);
    git(repository, ['push', 'origin', branch]);
    git(repository, ['switch', 'production']);
    const scripts = join(repository, 'scripts');
    mkdirSync(scripts);
    cpSync(mergeLocalScript, join(scripts, 'merge-local.sh'));
    chmodSync(join(scripts, 'merge-local.sh'), 0o755);
    const result = command(repository, 'sh', ['./scripts/merge-local.sh', branch, reviewedSha]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /reviewed head/i);
    assert.equal(git(repository, ['rev-parse', 'origin/production']), git(repository, ['rev-parse', 'production']));
  } finally {
    cleanup(root);
  }
});
