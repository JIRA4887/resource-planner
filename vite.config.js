import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './public', // This tells Vite to look for index.html inside the public folder
  build: {
    outDir: '../dist' // Output the build files in the 'dist' folder
  }
});
