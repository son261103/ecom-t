import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'http-vendor': ['axios'],
          'toast-vendor': ['react-hot-toast'],

          // Feature chunks
          'admin-pages': [
            './src/pages/admin/AdminDashboard',
            './src/pages/admin/ProductManagement',
            './src/pages/admin/ProductForm',
            './src/pages/admin/CategoryManagement',
            './src/pages/admin/BrandManagement',
            './src/pages/admin/OrderManagement',
            './src/pages/admin/UserManagement',
            './src/pages/admin/AdminOrderDetail',
            './src/pages/admin/AnalyticsDashboard',
          ],
          'user-pages': [
            './src/pages/user/ProfilePage',
            './src/pages/user/OrdersPage',
            './src/pages/user/OrderDetailPage',
          ],
          'auth-pages': [
            './src/pages/auth/LoginPage',
            './src/pages/auth/RegisterPage',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  },
})
