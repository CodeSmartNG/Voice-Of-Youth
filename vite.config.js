import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    rollupOptions: {
      // External packages that shouldn't be bundled
      // These will need to be provided by the user's environment
      external: [
        'some-external-package',
        'another-package'
      ]
    }
  }
})