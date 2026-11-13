import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
 server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3001', // Altere para a porta correta do seu backend (ex: 3000)
      changeOrigin: true,
    },
  },
}})
