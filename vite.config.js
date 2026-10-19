import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/sushi-tap/'

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'fiorella.png',
        'fiorella-start.png',
        'sushi.png',
        'icons/apple-touch-icon.png',
      ],
      manifest: {
        name: 'Sushi Tap',
        short_name: 'SushiTap',
        description: 'Contá las piezas de sushi que comieron',
        lang: 'es',
        theme_color: '#b8e7ff',
        background_color: '#b8e7ff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      },
    }),
  ],
})
