import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { useAuth } from '../../contexts';
import { orderService } from '../../services';
import type { OrderResponse, OrderStatus } from '../../types';
import { formatCurrency, formatDate, formatOrderStatus } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

const OrdersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  // Fetch user orders
  const {
    data: orders,
    loading,
    error,
  } = useAsync<OrderResponse[]>(
    () => orderService.getUserOrders(),
    [],
    { immediate: isAuthenticated }
  );

  // Filter orders based on status and search query
  const filteredOrders = orders?.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      order.id.toString().includes(searchQuery) ||
      order.orderDetails.some(detail => 
        detail.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  }) || [];

  const statusOptions = [
    { value: 'ALL' as const, label: 'Tất cả', count: orders?.length || 0 },
    { value: 'PENDING' as OrderStatus, label: 'Chờ xử lý', count: orders?.filter(o => o.status === 'PENDING').length || 0 },
    { value: 'PROCESSING' as OrderStatus, label: 'Đang xử lý', count: orders?.filter(o => o.status === 'PROCESSING').length || 0 },
    { value: 'COMPLETED' as OrderStatus, label: 'Hoàn thành', count: orders?.filter(o => o.status === 'COMPLETED').length || 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải đơn hàng..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Không thể tải đơn hàng
          </h2>
          <p className="text-secondary-600 mb-6">
            Có lỗi xảy ra khi tải danh sách đơn hàng. Vui lòng thử lại sau.
          </p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-secondary-600">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      statusFilter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="w-full lg:w-auto lg:min-w-[300px]">
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-secondary-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              {orders?.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng'}
            </h2>
            <p className="text-secondary-600 mb-8">
              {orders?.length === 0 
                ? 'Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!'
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            {orders?.length === 0 && (
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg">
                  Bắt đầu mua sắm
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Order Card Component
interface OrderCardProps {
  order: OrderResponse;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'PROCESSING':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-secondary-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  return (
    <Card hover>
      <div className="p-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            {getStatusIcon(order.status)}
            <div>
              <h3 className="font-semibold text-secondary-900">
                Đơn hàng #{order.id}
              </h3>
              <p className="text-sm text-secondary-600">
                Đặt ngày {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {formatOrderStatus(order.status)}
            </span>
            <Link to={`${ROUTES.ORDERS}/${order.id}`}>
              <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                Chi tiết
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3 mb-4">
          {order.orderDetails.slice(0, 3).map((detail) => (
            <div key={detail.id} className="flex items-center space-x-3">
              <img
                src={detail.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                alt={detail.productName}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 line-clamp-1">
                  {detail.productName}
                </p>
                <p className="text-sm text-secondary-600">
                  Số lượng: {detail.quantity} × {formatCurrency(detail.price)}
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatCurrency(detail.subtotal)}
              </p>
            </div>
          ))}
          
          {order.orderDetails.length > 3 && (
            <p className="text-sm text-secondary-600 text-center">
              và {order.orderDetails.length - 3} sản phẩm khác...
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-secondary-200">
          <div className="text-sm text-secondary-600 mb-2 sm:mb-0">
            <span>Giao đến: </span>
            <span className="font-medium text-secondary-900">
              {order.recipientName} - {order.shippingAddress}
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-secondary-600">Tổng cộng</p>
            <p className="text-lg font-bold text-primary-600">
              {formatCurrency(order.finalTotal)}
            </p>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Mã vận đơn:</span> {order.trackingNumber}
            </p>
            {order.estimatedDelivery && (
              <p className="text-sm text-blue-800">
                <span className="font-medium">Dự kiến giao:</span> {formatDate(order.estimatedDelivery)}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrdersPage;
