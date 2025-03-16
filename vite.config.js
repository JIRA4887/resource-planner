import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodePolyfills from '@esbuild-plugins/node-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodePolyfills({
          crypto: true,
        })
      ]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
