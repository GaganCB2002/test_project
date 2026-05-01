import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3004,
    host: '127.0.0.1',
    proxy: {
      '/api/auth': 'http://127.0.0.1:8081',
      '/api/hr': 'http://127.0.0.1:8081',
      '/api': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5005',
        ws: true,
      },
    },
  },
});
