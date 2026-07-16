import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy vendor libraries into separate cached chunks.
    // Benefits:
    //   1. Eliminates the >500 kB chunk warning.
    //   2. Browsers cache vendor chunks independently — app updates don't
    //      force visitors to re-download three.js or framer-motion.
    //   3. Chunks load in parallel, improving initial page load.
    rollupOptions: {
      output: {
        manualChunks: {
          // three.js ecosystem (~700 kB) — largest offender
          'vendor-three': ['three'],
          'vendor-r3f':   ['@react-three/fiber', '@react-three/drei'],
          // Framer Motion (~140 kB)
          'vendor-motion': ['framer-motion'],
          // React core — almost never changes, long-lived cache
          'vendor-react':  ['react', 'react-dom'],
        },
      },
    },
  },
})

