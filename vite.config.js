import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        titulacion: resolve(__dirname, 'titulacion.html'),
        serviciosocial: resolve(__dirname, 'servicio-social.html'),
        practicas: resolve(__dirname, 'practicas.html'),
        documentacion: resolve(__dirname, 'documentacion.html'),
      }
    }
  }
})
