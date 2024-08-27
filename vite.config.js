import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Default port
    host: true, // or '0.0.0.0'
  },

  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sjnetwork: './sjnetwork.html',
      },
    },
  },
})
