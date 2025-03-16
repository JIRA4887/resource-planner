import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        GlobalsPolyfills({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
    target: 'esnext', 
    outDir: 'dist',
  },
});
