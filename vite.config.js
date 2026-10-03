import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the framework out of the app chunk's hash. Without this every deploy
    // invalidates the single bundle, so returning visitors re-download React;
    // with it the vendor chunk stays byte-identical and hits cache. This is a
    // cache-lifetime win, not a byte win -- the same modules ship either way.
    rollupOptions: {
      output: {
        manualChunks: (id) =>
          id.includes('node_modules') &&
          (id.includes('react') || id.includes('scheduler'))
            ? 'react'
            : undefined,
      },
    },
  },
})
