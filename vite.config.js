import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['some-external-package'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    host: true // listen on all addresses
  },
  preview: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components'
    }
  }
})