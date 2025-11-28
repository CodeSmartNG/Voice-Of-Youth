import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['some-external-package']
    }
  },
  server: {
    port: 3000,
    open: true // automatically open browser
  }
})