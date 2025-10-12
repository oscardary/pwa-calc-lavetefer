// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Configuración Vite para producción (Netlify / SPA / PWA)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 👇 IMPORTANTE para que las rutas funcionen correctamente en producción
  base: "/",

  // 👇 Asegura que la carpeta de salida se llame 'dist' (Netlify la detecta)
  build: {
    outDir: "dist",
    sourcemap: false,
  },
})
