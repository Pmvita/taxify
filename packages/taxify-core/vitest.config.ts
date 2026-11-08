import { defineConfig } from 'vitest/config';

/**
 * On Windows, avoid running Vitest from paths that contain `)` (e.g. Desktop/MAIN
 * "1) Full-Stack…"). Use `subst T: "<repo>"` then `cd /d T:\` — Vitest/Vite
 * otherwise collect empty suites.
 */
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    pool: 'forks',
  },
});
