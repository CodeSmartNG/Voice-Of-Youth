import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    rollupOptions: {
      external: [
        'some-external-package',
        'another-package',
        // Add more external dependencies as needed
        'lodash',
        'axios',
        'moment',
        'jquery'
      ],
      
      output: {
        // Configure how external dependencies are handled
        globals: {
          'some-external-package': 'SomeExternalPackage',
          'another-package': 'AnotherPackage',
          'lodash': '_',
          'axios': 'axios',
          'moment': 'moment',
          'jquery': '$'
        }
      }
    },
    
    // Common build settings
    minify: 'esbuild',
    sourcemap: true,
    outDir: 'dist'
  },
  
  // Development server
  server: {
    port: 3000,
    open: true
  },
  
  // Preview server
  preview: {
    port: 4173
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils'
    }
  }
})