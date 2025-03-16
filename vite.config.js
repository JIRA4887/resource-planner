import crypto from 'node:crypto';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Explicit root directory
  build: {
    outDir: 'dist', 
    rollupOptions: {
      input: 'public/index.html' // Correct input path
    }
  }
});
