import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Grid,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts';
import { Button } from '../components/ui';
import { ROUTES } from '../utils/constants';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: ROUTES.ADMIN_DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      name: 'Sản phẩm',
      href: ROUTES.ADMIN_PRODUCTS,
      icon: Package,
    },
    {
      name: 'Danh mục',
      href: ROUTES.ADMIN_CATEGORIES,
      icon: Grid,
    },
    {
      name: 'Thương hiệu',
      href: ROUTES.ADMIN_BRANDS,
      icon: Tag,
    },
    {
      name: 'Đơn hàng',
      href: ROUTES.ADMIN_ORDERS,
      icon: ShoppingCart,
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Thống kê',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  // Generate breadcrumb from current path
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Trang chủ', href: ROUTES.HOME },
    ];

    if (pathSegments.includes('admin')) {
      breadcrumbs.push({ name: 'Admin', href: ROUTES.ADMIN_DASHBOARD });
      
      const currentItem = navigationItems.find(item => item.href === location.pathname);
      if (currentItem && currentItem.href !== ROUTES.ADMIN_DASHBOARD) {
        breadcrumbs.push({ name: currentItem.name, href: currentItem.href });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumb();

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-display font-bold text-gradient">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                             (item.href !== ROUTES.ADMIN_DASHBOARD && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-500'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center space-x-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-secondary-400" />}
                    <Link
                      to={crumb.href}
                      className={`${
                        index === breadcrumbs.length - 1
                          ? 'text-secondary-900 font-medium'
                          : 'text-secondary-500 hover:text-secondary-700'
                      }`}
                    >
                      {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link to={ROUTES.HOME}>
                <Button variant="outline" size="sm">
                  Xem trang web
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

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

export default AdminLayout;
