import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cualquier petición que comience con '/api' será redirigida
      '/api': {
        // La URL de nuestro servidor backend
        target: 'http://localhost:3001',
        // Necesario para que el backend reciba el host correcto
        changeOrigin: true,
        // No necesitamos reescribir el path, ya que nuestras rutas de backend
        // ya incluyen '/api'.
      },
    },
  },
})
