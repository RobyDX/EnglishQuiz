import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

// The whole project (package.json, node_modules, config, sources) lives in src/; the build goes to ../docs.
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // The question files (src/data/<level>/<type>.json) go to assets/data/: they are not precached
        // but cached at runtime when a level is first used (see workbox below and specs/05-pwa.md).
        chunkFileNames: (chunk) =>
          chunk.moduleIds.some((id) => /\/data\/[^/]+\/[^/]+\.json$/.test(id)) ? 'assets/data/[name]-[hash].js' : 'assets/[name]-[hash].js',
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifestFilename: 'manifest.json', // .json is served by every web server, .webmanifest is not
      manifest: {
        name: 'English Quiz',
        short_name: 'English Quiz',
        description: 'English exercises by CEFR level',
        lang: 'en',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#012169',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,ico}'],
        // Question files are cached when first used, not at install time.
        globIgnores: ['assets/data/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/data\/[^/]+\.js$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'eq-data',
              // ~15 files per level x 6 levels, with room for the previous version while it is replaced.
              expiration: { maxEntries: 200, purgeOnQuotaError: true },
            },
          },
        ],
      },
    }),
  ],
  test: {
    // The PWA virtual module does not resolve under Vitest (fails on some setups): use a stub.
    alias: { 'virtual:pwa-register/react': fileURLToPath(new URL('./test-pwa-register.ts', import.meta.url)) },
    environment: 'jsdom',
    // PlacementPage tests click through 40 questions with userEvent: slow on a loaded machine (deploy.bat).
    testTimeout: 30000,
    setupFiles: ['./test-setup.ts'], exclude: ['node_modules/**'],
    include: ['**/*.test.{ts,tsx}'],
  },
});
