import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({}),
  ],
  assetsInclude: ['**/*.apk'],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // NEW: Build optimizations
  build: {
    chunkSizeWarningLimit: 1600, // Increases the limit to 1600kb (1.6MB) to silence warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate huge 3rd party libraries into their own files
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Animation libraries (usually large)
            if (id.includes('framer-motion') || id.includes('lottie')) {
              return 'animations';
            }
            // Charting libraries
            if (id.includes('recharts')) {
              return 'charts';
            }
            // Icons and utilities
            if (id.includes('lucide') || id.includes('stripe')) {
              return 'utils';
            }
            
            // Everything else
            return 'vendor';
          }
        },
      },
    },
  },
});