import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle,
  DollarSign,
  User,
  Calendar,
  
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { orderService } from '../../services';
import type { OrderResponse, OrderStatus } from '../../types';
import {
  formatCurrency,
  formatDate,
  formatPaymentStatus,
  formatPaymentMethod
} from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const OrderManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  // Fetch orders
  const {
    data: orders,
    loading,
    execute: refetchOrders,
  } = useAsync<OrderResponse[]>(
    () => orderService.getAllOrders(),
    [],
    { immediate: true }
  );

  const handleUpdateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      refetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Filter orders
  const filteredOrders = orders?.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      order.id.toString().includes(searchQuery) ||
      order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.recipientPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  }) || [];

  const statusOptions = [
    { value: 'ALL' as const, label: 'Tất cả', count: orders?.length || 0, color: 'bg-secondary-100 text-secondary-800' },
    { value: 'PENDING' as OrderStatus, label: 'Chờ xử lý', count: orders?.filter(o => o.status === 'PENDING').length || 0, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PROCESSING' as OrderStatus, label: 'Đang xử lý', count: orders?.filter(o => o.status === 'PROCESSING').length || 0, color: 'bg-blue-100 text-blue-800' },
    { value: 'COMPLETED' as OrderStatus, label: 'Hoàn thành', count: orders?.filter(o => o.status === 'COMPLETED').length || 0, color: 'bg-green-100 text-green-800' },
  ];

  const totalRevenue = orders?.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.finalTotal, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-secondary-600">
            Theo dõi và xử lý tất cả đơn hàng trong hệ thống
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {orders?.length || 0}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders?.filter(o => o.status === 'PENDING').length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orders?.filter(o => o.status === 'COMPLETED').length || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Doanh thu</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
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
                        : option.color
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
                  placeholder="Tìm kiếm theo mã đơn hàng, tên, SĐT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-secondary-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            #{order.id}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {order.orderDetails.length} sản phẩm
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-secondary-900">
                              {order.recipientName}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {order.recipientPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {formatCurrency(order.finalTotal)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-900">
                          {formatPaymentMethod(order.paymentMethod)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                          order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {formatPaymentStatus(order.paymentStatus)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="PROCESSING">Đang xử lý</option>
                          <option value="COMPLETED">Hoàn thành</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderManagement;
