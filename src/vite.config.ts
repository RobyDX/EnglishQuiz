import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

// The whole project (package.json, node_modules, config, sources) lives in src/; the build goes to ../docs.
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: { outDir: '../docs', emptyOutDir: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
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
      workbox: { globPatterns: ['**/*.{js,css,html,json,svg,png,ico}'] },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'], exclude: ['node_modules/**'],
    include: ['**/*.test.{ts,tsx}'],
  },
});
