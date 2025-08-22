import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Divider */}
      <div className="border-t border-secondary-200 bg-gradient-to-r from-primary-100 via-secondary-100 to-primary-100"></div>

      <Footer />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
