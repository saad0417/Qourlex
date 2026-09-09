import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    // Without an explicit target the CSS minifier decided only Safari's
    // -webkit-backdrop-filter was needed and dropped the standard property,
    // which silently disabled every frosted surface on the site in Chrome and
    // Firefox. Naming a baseline that still includes a Safari needing the
    // prefix makes it emit both.
    cssTarget: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
        },
      },
    },
  },
});
