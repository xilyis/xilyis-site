import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Where the site is served from (Vite's `base`).
 *
 *  - Local dev, Cloudflare Pages, custom domains:  '/'
 *  - GitHub Pages project site (user.github.io/<repo>/):  '/<repo>/'
 *
 * Chosen automatically, first match wins:
 *  1. `vite build --base=/x/` on the command line (Vite applies it over this file).
 *  2. The SITE_BASE environment variable, e.g. SITE_BASE=/ (use this if you ever
 *     deploy to Cloudflare from inside a GitHub Actions run).
 *  3. Dev server: always '/'.
 *  4. Inside a GitHub Actions run: '/<repo name>/' (or '/' for <name>.github.io repos).
 *  5. Everything else: '/'.
 *
 * For a manual GitHub Pages build on your own computer, run `npm run build:github`.
 */
const resolveBase = (command: 'build' | 'serve'): string => {
  if (process.env.SITE_BASE) return process.env.SITE_BASE;
  if (command === 'serve') return '/';

  const repository = process.env.GITHUB_REPOSITORY; // "owner/repo", set by GitHub Actions
  if (process.env.GITHUB_ACTIONS && repository) {
    const repo = repository.split('/')[1];
    return repo.endsWith('.github.io') ? '/' : `/${repo}/`;
  }

  return '/';
};

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: resolveBase(command),
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
}));