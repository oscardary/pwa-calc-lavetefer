
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: keeping PWA simple with a manual service worker and manifest in /public
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
