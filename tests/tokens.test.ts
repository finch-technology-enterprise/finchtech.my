import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('Saasland tokens', () => {
  it('defines ink/sky/amber/sky-soft and mesh in globals.css', () => {
    const css = fs.readFileSync('app/globals.css', 'utf8');
    expect(css).toContain('--ink: #0f172a');
    expect(css).toContain('--sky: #0ea5e9');
    expect(css).toContain('--amber: #f59e0b');
    expect(css).toContain('--sky-soft:');
    expect(css).toContain('radial-gradient');
    expect(css).toContain('--ease-spring');
    expect(css).toContain('prefers-reduced-motion');
  });
});
