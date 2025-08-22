import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { useAuth, useCart } from '../../contexts';
import { Button } from '../ui';
import { ROUTES } from '../../utils/constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const cartItemCount = cart?.totalItems || 0;

  const navigationItems = [
    { name: 'Trang chủ', href: ROUTES.HOME },
    { name: 'Sản phẩm', href: ROUTES.PRODUCTS },
    { name: 'Tin tức', href: ROUTES.NEWS },
    { name: 'Giới thiệu', href: ROUTES.ABOUT },
  ];

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2 mr-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-display font-bold text-gradient">
                Electro
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 mr-8">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors duration-200 relative ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-secondary-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-lg mr-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Mobile Search */}
            <button className="lg:hidden p-2 text-secondary-600 hover:text-primary-600">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to={ROUTES.CART} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-secondary-100 py-1"
                    >
                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Tài khoản</span>
                      </Link>
                      <Link
                        to={ROUTES.ORDERS}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span>Đơn hàng</span>
                      </Link>

                      {user?.role === 'ADMIN' && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Quản trị</span>
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-secondary-200 py-4"
            >
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`font-medium transition-colors duration-200 py-2 px-4 rounded-lg ${
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
