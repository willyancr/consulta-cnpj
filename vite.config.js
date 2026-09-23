import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api-cnpj': {
        target: 'https://publica.cnpj.ws/cnpj',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-cnpj/, ''),
        secure: true,
      }
    }
  },
  preview: {
    port: 3000,
    proxy: {
      '/api-cnpj': {
        target: 'https://publica.cnpj.ws/cnpj',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-cnpj/, ''),
        secure: true,
      }
    }
  }
})
