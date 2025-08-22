import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Contexts
import { AuthProvider, CartProvider } from './contexts';

// Layouts
import { MainLayout, AdminLayout } from './layouts';

// Pages
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProductsPage,
  ProductDetailPage,
  NewsPage,
  NewsDetailPage,
  AboutPage,
  CartPage,
  CheckoutPage,
  ProfilePage,
  OrdersPage,
  OrderDetailPage,
  AdminDashboard,
  ProductManagement,
  ProductForm,
  CategoryManagement,
  BrandManagement,
  OrderManagement,
  UserManagement,
  AdminOrderDetail,
  AnalyticsDashboard,
} from './pages';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Utils
import { ROUTES } from './utils/constants';

function App() {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Main Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />

              {/* Public Routes */}
              <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
              <Route path={`${ROUTES.PRODUCTS}/:id`} element={<ProductDetailPage />} />
              <Route path={ROUTES.NEWS} element={<NewsPage />} />
              <Route path={`${ROUTES.NEWS}/:id`} element={<NewsDetailPage />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />

              {/* Protected User Routes */}
              <Route path={ROUTES.CART} element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.CHECKOUT} element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />              <Route path={ROUTES.ORDERS} element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path={`${ROUTES.ORDERS}/:id`} element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              } />

            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/create" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="brands" element={<BrandManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="settings" element={<div>Settings</div>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
