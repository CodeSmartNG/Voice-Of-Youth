import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})