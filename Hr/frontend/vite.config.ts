import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 3005,
    host: '127.0.0.1',
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
      '/api': 'http://127.0.0.1:8081',
      '/health': 'http://127.0.0.1:8081',
    },
  },
})
