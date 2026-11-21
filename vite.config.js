import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Relative path agar bisa dibuka langsung dan deploy mulus di Vercel
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096
  }
});
