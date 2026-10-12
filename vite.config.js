import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/media/foundation': { target: env.VITE_PROXY_TARGET || 'http://localhost:8080', changeOrigin: true },
      '/api': { target: env.VITE_PROXY_TARGET || 'http://localhost:8080', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-router') || id.includes('react-dom') || /[\\/]react[\\/]/.test(id)) return 'react-vendor'
          if (id.includes('motion-dom') || id.includes('motion-utils') || /[\\/]motion[\\/]/.test(id)) return 'motion-vendor'
          if (id.includes('lucide-react')) return 'icons-vendor'
          if (id.includes('sonner')) return 'toast-vendor'
          if (id.includes('axios')) return 'http-vendor'
          return 'vendor'
        },
      },
    },
  },
  }
})
