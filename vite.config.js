import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Manual chunking to split echarts into its own vendor chunk for better caching
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) return 'vendor_echarts'
            return 'vendor'
          }
        }
      }
    }
  }
})
