import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './public', // This tells Vite where to find index.html
  plugins: [react()],
});
