import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Remove the root configuration since index.html is in the default location
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
