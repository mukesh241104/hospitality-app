import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/hotelbeds-api': {
        target: 'https://api.test.hotelbeds.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hotelbeds-api/, ''),
      }
    }
  }
})
