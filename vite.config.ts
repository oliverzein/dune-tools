import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Water Harvest Notifier',
        short_name: 'WaterNotifier',
        start_url: '.',
        display: 'standalone',
        background_color: '#242424',
        theme_color: '#4caf50',
        description: 'Get notified at optimal water harvest times.',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: ['dunetools.ozhome.xyz']
  }
})