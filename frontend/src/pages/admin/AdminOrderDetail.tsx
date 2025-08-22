import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Edit,
  Save,
  Printer,
  
} from 'lucide-react';
import { Card, Button, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { orderService } from '../../services';
import type {  OrderResponse, OrderStatus } from '../../types';
import { 
  formatCurrency, 
  formatDate, 
  formatOrderStatus, 
  formatPaymentStatus,
  formatPaymentMethod 
} from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  // Fetch order details
  const {
    data: order,
    loading,
    error,
    execute: refetchOrder,
  } = useAsync<OrderResponse>(
    () => orderService.getOrderById(Number(id)),
    [id]
  );

  // Initialize form values when order loads
  React.useEffect(() => {
    if (order) {
      setTrackingNumber(order.trackingNumber || '');
      setEstimatedDelivery(order.estimatedDelivery ? order.estimatedDelivery.split('T')[0] : '');
    }
  }, [order]);

  const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(Number(id), { status: newStatus });
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      refetchOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleSaveTracking = async () => {
    try {
      // This would be a separate API call to update tracking info
      // await orderService.updateOrderTracking(Number(id), { trackingNumber, estimatedDelivery });
      toast.success('Cập nhật thông tin vận chuyển thành công!');
      setIsEditing(false);
      refetchOrder();
    } catch (error) {
      console.error('Error updating tracking info:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin vận chuyển');
    }
  };

  const handlePrintInvoice = () => {
    // This would generate and print invoice
    toast('Tính năng in hóa đơn đang được phát triển');
  };

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
          <Button onClick={() => navigate('/admin/orders')}>
            Quay lại danh sách đơn hàng
          </Button>
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/orders')}
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

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handlePrintInvoice}
              icon={<Printer className="w-4 h-4" />}
            >
              In hóa đơn
            </Button>
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="font-medium">
                {formatOrderStatus(order.status)}
              </span>
            </div>
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
                        <div className="font-medium text-secondary-900 line-clamp-2">
                          {detail.productName}
                        </div>
                        <p className="text-secondary-600 mt-1">
                          Số lượng: {detail.quantity} × {formatCurrency(detail.price)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">
                          {formatCurrency(detail.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Customer & Shipping Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin khách hàng & giao hàng
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-secondary-900">Thông tin khách hàng</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-900">{order.recipientName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-secondary-400" />
                        <span className="text-secondary-900">{order.recipientPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-secondary-900">Địa chỉ giao hàng</h3>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-secondary-400 mt-0.5" />
                      <div className="text-secondary-900">
                        {order.shippingAddress}, {order.shippingWard}, {order.shippingDistrict}, {order.shippingCity}
                        {order.shippingPostalCode && `, ${order.shippingPostalCode}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                    <h3 className="font-medium text-secondary-900 mb-2">Ghi chú đơn hàng</h3>
                    <p className="text-secondary-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Shipping Information */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Thông tin vận chuyển
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    icon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  >
                    {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Mã vận đơn
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Nhập mã vận đơn"
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày giao dự kiến
                      </label>
                      <input
                        type="date"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <Button onClick={handleSaveTracking}>
                      Lưu thông tin vận chuyển
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {order.trackingNumber ? (
                      <p className="text-secondary-900">
                        <span className="font-medium">Mã vận đơn:</span> {order.trackingNumber}
                      </p>
                    ) : (
                      <p className="text-secondary-500">Chưa có mã vận đơn</p>
                    )}
                    
                    {order.estimatedDelivery ? (
                      <p className="text-secondary-900">
                        <span className="font-medium">Dự kiến giao:</span> {formatDate(order.estimatedDelivery, 'long')}
                      </p>
                    ) : (
                      <p className="text-secondary-500">Chưa có ngày giao dự kiến</p>
                    )}
                    
                    {order.deliveredAt && (
                      <p className="text-green-800">
                        <span className="font-medium">Đã giao:</span> {formatDate(order.deliveredAt, 'long')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Cập nhật trạng thái
                </h2>
                
                <div className="space-y-3">
                  {(['PENDING', 'PROCESSING', 'COMPLETED'] as OrderStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(status)}
                      className={`w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                        order.status === status
                          ? getStatusColor(status).replace('border-', 'border ')
                          : 'bg-secondary-50 hover:bg-secondary-100 text-secondary-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(status)}
                        <span className="font-medium">
                          {formatOrderStatus(status)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
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

export default AdminOrderDetail;
