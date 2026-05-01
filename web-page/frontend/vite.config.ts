import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 3005,
    host: true,
    proxy: {
      '/api/helpdesk': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/helpdesk/, '/api'),
      },
      '/api/techlead': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/techlead/, '/api'),
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        ws: true,
      },
      '/health': 'http://127.0.0.1:5001',
    },
  },
})
