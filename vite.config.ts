import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), //desactivar termporalmente
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  //CONFIGURACIÓN PROXY PARA EL BACKEND
  server: {
    proxy: {
      // Cuando una solicitud comienza con '/api'
      '^/api': {
        // Redirige a esta URL (tu backend de Spring Boot)
        target: 'http://localhost:8080',
        // Cambia el origen (host) de la solicitud a 'http://localhost:8080'
        changeOrigin: true,
      },
    },
  },
})
