import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// The title, description and share image in index.html are what search engines
// and link previews (WhatsApp, Facebook, X) see before any script runs, so
// they follow the product switches (src/config/features.ts) at build time.
const SITE_META = {
  hotelsOnly: {
    title: 'TravelMate — Hotels, Villas & Resorts Worldwide',
    description: 'Find hotels, villas and resorts worldwide with TravelMate. Search by place and dates, compare stays and check live prices.',
    image: 'https://travelmateglo.com/og-image-hotels.jpg',
  },
  allProducts: {
    title: 'TravelMate — Book Stays, Flights & Airport Transfers in One Place',
    description: 'TravelMate is a travel booking platform for stays, flights, and airport transfers — one account, real prices, secure checkout.',
    image: 'https://travelmateglo.com/og-image.jpg',
  },
}

const siteMeta = (env: Record<string, string>): Plugin => {
  const hotelsOnly = !['STAYS', 'TRANSFERS', 'FLIGHTS'].some((p) => env[`VITE_FEATURE_${p}`] === 'on')
  const meta = hotelsOnly ? SITE_META.hotelsOnly : SITE_META.allProducts
  return {
    name: 'travelmate-site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replaceAll('%SITE_TITLE%', meta.title)
          .replaceAll('%SITE_DESCRIPTION%', meta.description)
          .replaceAll('%SITE_IMAGE%', meta.image),
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
    // .env files plus the build's own environment (e.g. Vercel's settings)
    siteMeta(loadEnv(mode, process.cwd(), 'VITE_')),
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
}))
