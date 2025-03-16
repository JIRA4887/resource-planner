import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Set root as current folder
  build: {
    rollupOptions: {
      input: './index.html' // 👈 Entry point
    }
  }
});
