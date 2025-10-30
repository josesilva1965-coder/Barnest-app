import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
      server: {
        port: 3000,
        host: '0.0.0.0',
        watch: {
          ignored: ['.env', 'tsconfig.json', 'vite.config.ts'],
        },
        proxy: {
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
          },
        },
        headers: {
          'Content-Security-Policy': "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
});
