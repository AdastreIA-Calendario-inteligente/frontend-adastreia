import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: process.env.PORT || 4173, 
    proxy: {
      "/api": {
        target: "https://backend-adastreia.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: true, 
    port: process.env.PORT || 4173, 
  },
})