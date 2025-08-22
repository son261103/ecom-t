import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  
} from 'lucide-react';
import { Card, Button, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { orderService } from '../../services';
import type { OrderResponse, OrderStatus, PaymentStatus } from '../../types';
import { 
  formatCurrency, 
  formatDate, 
  formatOrderStatus, 
  formatPaymentStatus,
  formatPaymentMethod 
} from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch order details
  const {
    data: order,
    loading,
    error,
  } = useAsync<OrderResponse>(
    () => orderService.getUserOrderById(Number(id)),
    [id]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-secondary-600 mb-6">
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to={ROUTES.ORDERS}>
            <Button>Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'PROCESSING':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-secondary-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.ORDERS)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900">
                Đơn hàng #{order.id}
              </h1>
              <p className="text-secondary-600">
                Đặt ngày {formatDate(order.createdAt, 'long')}
              </p>
            </div>
          </div>

          <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="font-medium">
              {formatOrderStatus(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Sản phẩm đã đặt ({order.orderDetails.length})
                </h2>
                
                <div className="space-y-4">
                  {order.orderDetails.map((detail) => (
                    <div key={detail.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg">
                      <img
                        src={detail.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                        alt={detail.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`${ROUTES.PRODUCTS}/${detail.productId}`}
                          className="font-medium text-secondary-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2"
                        >
                          {detail.productName}
                        </Link>
                        <p className="text-secondary-600 mt-1">
                          Số lượng: {detail.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">
                          {formatCurrency(detail.price)}
                        </p>
                        <p className="text-sm text-secondary-600">
                          Tổng: {formatCurrency(detail.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Thông tin giao hàng
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-secondary-400" />
                      <div>
                        <p className="text-sm text-secondary-600">Người nhận</p>
                        <p className="font-medium text-secondary-900">{order.recipientName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary-400" />
                      <div>
                        <p className="text-sm text-secondary-600">Số điện thoại</p>
                        <p className="font-medium text-secondary-900">{order.recipientPhone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-secondary-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondary-600">Địa chỉ giao hàng</p>
                        <p className="font-medium text-secondary-900">
                          {order.shippingAddress}, {order.shippingWard}, {order.shippingDistrict}, {order.shippingCity}
                          {order.shippingPostalCode && `, ${order.shippingPostalCode}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-900">Thông tin vận chuyển</h3>
                    </div>
                    <p className="text-blue-800">
                      <span className="font-medium">Mã vận đơn:</span> {order.trackingNumber}
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-blue-800">
                        <span className="font-medium">Dự kiến giao:</span> {formatDate(order.estimatedDelivery, 'long')}
                      </p>
                    )}
                    {order.deliveredAt && (
                      <p className="text-green-800">
                        <span className="font-medium">Đã giao:</span> {formatDate(order.deliveredAt, 'long')}
                      </p>
                    )}
                  </div>
                )}

                {/* Order Notes */}
                {order.notes && (
                  <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                    <h3 className="font-medium text-secondary-900 mb-2">Ghi chú đơn hàng</h3>
                    <p className="text-secondary-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Thanh toán
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Phương thức:</span>
                    <span className="font-medium">{formatPaymentMethod(order.paymentMethod)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {formatPaymentStatus(order.paymentStatus)}
                    </span>
                  </div>
                  
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Thanh toán lúc:</span>
                      <span className="font-medium">{formatDate(order.paidAt, 'long')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Tóm tắt đơn hàng
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Tạm tính:</span>
                    <span className="font-medium">{formatCurrency(order.totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Giảm giá:</span>
                    <span className="font-medium">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary-600">{formatCurrency(order.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Timeline */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Lịch sử đơn hàng
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-secondary-900">Đơn hàng đã được tạo</p>
                      <p className="text-sm text-secondary-600">{formatDate(order.createdAt, 'long')}</p>
                    </div>
                  </div>
                  
                  {order.status !== 'PENDING' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-secondary-900">Đơn hàng đang được xử lý</p>
                        <p className="text-sm text-secondary-600">{formatDate(order.updatedAt, 'long')}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'COMPLETED' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-secondary-900">Đơn hàng đã hoàn thành</p>
                        <p className="text-sm text-secondary-600">
                          {order.deliveredAt ? formatDate(order.deliveredAt, 'long') : formatDate(order.updatedAt, 'long')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
