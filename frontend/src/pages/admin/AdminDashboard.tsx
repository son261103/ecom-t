import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Grid,
  Tag,
} from 'lucide-react';
import { Card, Button, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { productService, orderService, categoryService, brandService } from '../../services';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

const AdminDashboard: React.FC = () => {
  // Fetch dashboard data
  const { data: products, loading: productsLoading } = useAsync(
    () => productService.getAllProducts(),
    []
  );

  const { data: orders, loading: ordersLoading } = useAsync(
    () => orderService.getAllOrders(),
    []
  );

  const { data: categories, loading: categoriesLoading } = useAsync(
    () => categoryService.getAdminCategories(),
    []
  );

  const { data: brands, loading: brandsLoading } = useAsync(
    () => brandService.getAdminBrands(),
    []
  );

  const isLoading = productsLoading || ordersLoading || categoriesLoading || brandsLoading;

  // Calculate statistics
  const stats = {
    totalProducts: products?.length || 0,
    activeProducts: products?.filter(p => p.isActive).length || 0,
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(o => o.status === 'PENDING').length || 0,
    processingOrders: orders?.filter(o => o.status === 'PROCESSING').length || 0,
    completedOrders: orders?.filter(o => o.status === 'COMPLETED').length || 0,
    totalRevenue: orders?.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.finalTotal, 0) || 0,
    totalCategories: categories?.length || 0,
    totalBrands: brands?.length || 0,
  };

  const recentOrders = orders?.slice(0, 5) || [];
  const lowStockProducts = products?.filter(p => p.stockQuantity < 10).slice(0, 5) || [];

  const quickActions = [
    {
      title: 'Thêm sản phẩm',
      description: 'Tạo sản phẩm mới',
      icon: <Plus className="w-6 h-6" />,
      href: '/admin/products/create',
      color: 'bg-blue-500',
    },
    {
      title: 'Quản lý đơn hàng',
      description: 'Xem và xử lý đơn hàng',
      icon: <ShoppingCart className="w-6 h-6" />,
      href: ROUTES.ADMIN_ORDERS,
      color: 'bg-green-500',
    },
    {
      title: 'Quản lý danh mục',
      description: 'Thêm/sửa danh mục',
      icon: <Grid className="w-6 h-6" />,
      href: ROUTES.ADMIN_CATEGORIES,
      color: 'bg-purple-500',
    },
    {
      title: 'Quản lý thương hiệu',
      description: 'Thêm/sửa thương hiệu',
      icon: <Tag className="w-6 h-6" />,
      href: ROUTES.ADMIN_BRANDS,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Dashboard Quản trị
          </h1>
          <p className="text-secondary-600">
            Tổng quan về hoạt động kinh doanh và quản lý hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng sản phẩm"
            value={formatNumber(stats.totalProducts)}
            subtitle={`${stats.activeProducts} đang hoạt động`}
            icon={<Package className="w-6 h-6" />}
            color="bg-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatsCard
            title="Tổng đơn hàng"
            value={formatNumber(stats.totalOrders)}
            subtitle={`${stats.pendingOrders} chờ xử lý`}
            icon={<ShoppingCart className="w-6 h-6" />}
            color="bg-green-500"
            trend={{ value: 8, isPositive: true }}
          />
          
          <StatsCard
            title="Doanh thu"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Từ đơn hàng hoàn thành"
            icon={<DollarSign className="w-6 h-6" />}
            color="bg-purple-500"
            trend={{ value: 15, isPositive: true }}
          />
          
          <StatsCard
            title="Danh mục & Thương hiệu"
            value={`${stats.totalCategories} / ${stats.totalBrands}`}
            subtitle="Danh mục / Thương hiệu"
            icon={<Grid className="w-6 h-6" />}
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              Thao tác nhanh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={action.href}>
                    <Card className="group cursor-pointer h-full" hover>
                      <div className="p-4 text-center">
                        <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white group-hover:scale-110 transition-transform duration-200`}>
                          {action.icon}
                        </div>
                        <h3 className="font-medium text-secondary-900 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {action.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Đơn hàng gần đây
                </h2>
                <Link to={ROUTES.ADMIN_ORDERS}>
                  <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                    Xem tất cả
                  </Button>
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <p className="text-secondary-600 text-center py-8">
                  Chưa có đơn hàng nào
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">
                          Đơn hàng #{order.id}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {order.userName} - {formatCurrency(order.finalTotal)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Low Stock Products */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Sản phẩm sắp hết hàng
                </h2>
                <Link to={ROUTES.ADMIN_PRODUCTS}>
                  <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                    Xem tất cả
                  </Button>
                </Link>
              </div>
              
              {lowStockProducts.length === 0 ? (
                <p className="text-secondary-600 text-center py-8">
                  Tất cả sản phẩm đều có đủ hàng
                </p>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-secondary-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-secondary-600">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stockQuantity === 0 ? 'bg-red-100 text-red-800' :
                        product.stockQuantity < 5 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.stockQuantity} còn lại
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  return (
    <Card hover>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{trend.value}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-1">
            {value}
          </h3>
          <p className="text-sm text-secondary-600">{title}</p>
          <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default AdminDashboard;
