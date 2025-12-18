import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        // Proxy removed - use environment variables in production
    },
    build: {
        // Optimize build for production
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor chunks for better caching
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'socket-vendor': ['socket.io-client'],
                }
            }
        },
        // Warn on chunks larger than 500kb
        chunkSizeWarningLimit: 500,
    }
})
