import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  PieChart,
  Activity,
  
} from 'lucide-react';
import { Card, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { formatCurrency, formatNumber } from '../../utils/formatters';

// Mock analytics data since we don't have analytics endpoints yet
const mockAnalyticsService = {
  getRevenueStats: async () => ({
    totalRevenue: 125000000,
    monthlyRevenue: 15000000,
    revenueGrowth: 12.5,
    revenueData: [
      { month: 'T1', revenue: 8000000 },
      { month: 'T2', revenue: 9500000 },
      { month: 'T3', revenue: 11000000 },
      { month: 'T4', revenue: 12500000 },
      { month: 'T5', revenue: 13000000 },
      { month: 'T6', revenue: 15000000 },
    ],
  }),
  
  getOrderStats: async () => ({
    totalOrders: 1250,
    monthlyOrders: 180,
    orderGrowth: 8.3,
    orderStatusData: [
      { status: 'Hoàn thành', count: 850, percentage: 68 },
      { status: 'Đang xử lý', count: 250, percentage: 20 },
      { status: 'Chờ xử lý', count: 150, percentage: 12 },
    ],
  }),
  
  getTopProducts: async () => [
    { id: 1, name: 'iPhone 15 Pro Max', sales: 125, revenue: 375000000 },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', sales: 98, revenue: 294000000 },
    { id: 3, name: 'MacBook Pro M3', sales: 75, revenue: 337500000 },
    { id: 4, name: 'iPad Air', sales: 65, revenue: 130000000 },
    { id: 5, name: 'AirPods Pro', sales: 150, revenue: 75000000 },
  ],
  
  getCustomerStats: async () => ({
    totalCustomers: 2500,
    newCustomers: 125,
    customerGrowth: 15.2,
    customerRetention: 78.5,
  }),
};

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Fetch analytics data
  const { data: revenueStats, loading: revenueLoading } = useAsync(
    () => mockAnalyticsService.getRevenueStats(),
    [timeRange]
  );

  const { data: orderStats, loading: orderLoading } = useAsync(
    () => mockAnalyticsService.getOrderStats(),
    [timeRange]
  );

  const { data: topProducts, loading: productsLoading } = useAsync(
    () => mockAnalyticsService.getTopProducts(),
    [timeRange]
  );

  const { data: customerStats, loading: customerLoading } = useAsync(
    () => mockAnalyticsService.getCustomerStats(),
    [timeRange]
  );

  const isLoading = revenueLoading || orderLoading || productsLoading || customerLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải dữ liệu analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-secondary-600">
              Thống kê và phân tích dữ liệu kinh doanh
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  timeRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                {range === '7d' ? '7 ngày' : 
                 range === '30d' ? '30 ngày' :
                 range === '90d' ? '90 ngày' : '1 năm'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Tổng doanh thu"
            value={formatCurrency(revenueStats?.totalRevenue || 0)}
            change={revenueStats?.revenueGrowth || 0}
            icon={<DollarSign className="w-6 h-6" />}
            color="bg-green-500"
          />
          
          <MetricCard
            title="Đơn hàng"
            value={formatNumber(orderStats?.totalOrders || 0)}
            change={orderStats?.orderGrowth || 0}
            icon={<ShoppingCart className="w-6 h-6" />}
            color="bg-blue-500"
          />
          
          <MetricCard
            title="Khách hàng"
            value={formatNumber(customerStats?.totalCustomers || 0)}
            change={customerStats?.customerGrowth || 0}
            icon={<Users className="w-6 h-6" />}
            color="bg-purple-500"
          />
          
          <MetricCard
            title="Tỷ lệ giữ chân"
            value={`${customerStats?.customerRetention || 0}%`}
            change={5.2}
            icon={<Activity className="w-6 h-6" />}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Doanh thu theo tháng
                </h2>
                <BarChart3 className="w-5 h-5 text-secondary-400" />
              </div>
              
              <div className="space-y-4">
                {revenueStats?.revenueData.map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-secondary-600">{item.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(item.revenue / Math.max(...revenueStats.revenueData.map(d => d.revenue))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-secondary-900 w-20 text-right">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Order Status Chart */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Trạng thái đơn hàng
                </h2>
                <PieChart className="w-5 h-5 text-secondary-400" />
              </div>
              
              <div className="space-y-4">
                {orderStats?.orderStatusData.map((item, index) => {
                  const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500'];
                  return (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                        <span className="text-secondary-700">{item.status}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-secondary-500">{item.percentage}%</span>
                        <span className="text-sm font-medium text-secondary-900">
                          {formatNumber(item.count)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Sản phẩm bán chạy
              </h2>
              <Package className="w-5 h-5 text-secondary-400" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 text-sm font-medium text-secondary-500">Sản phẩm</th>
                    <th className="text-right py-3 text-sm font-medium text-secondary-500">Đã bán</th>
                    <th className="text-right py-3 text-sm font-medium text-secondary-500">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts?.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-secondary-100"
                    >
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-secondary-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-secondary-700">
                        {formatNumber(product.sales)}
                      </td>
                      <td className="py-4 text-right font-medium text-secondary-900">
                        {formatCurrency(product.revenue)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <Card hover>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
          <div className={`flex items-center space-x-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-1">
            {value}
          </h3>
          <p className="text-sm text-secondary-600">{title}</p>
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsDashboard;
