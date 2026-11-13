import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  // Loaded on click (flight itinerary PDF). Pre-bundled so the dev server
  // doesn't reload the page the first time it is imported.
  optimizeDeps: {
    include: ['jspdf'],
  },
})
