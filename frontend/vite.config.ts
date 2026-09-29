import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/SocialPulse-AI/',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5175,
    strictPort: false, // Automatically fallback to next available port if occupied
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
});
