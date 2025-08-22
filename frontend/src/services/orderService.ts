import { apiClient } from './api';
import type {
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  ApiResponse,
} from '../types';

export class OrderService {
  // User order endpoints
  async getUserOrders(): Promise<OrderResponse[]> {
    return apiClient.get<OrderResponse[]>('/user/orders');
  }

  async getUserOrderById(orderId: number): Promise<OrderResponse> {
    return apiClient.get<OrderResponse>(`/user/orders/${orderId}`);
  }

  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    return apiClient.post<OrderResponse>('/user/orders', orderData);
  }

  async cancelOrder(orderId: number): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/user/orders/${orderId}/cancel`);
  }

  // Admin order endpoints
  async getAllOrders(): Promise<OrderResponse[]> {
    return apiClient.get<OrderResponse[]>('/admin/orders');
  }

  async getOrderById(orderId: number): Promise<OrderResponse> {
    return apiClient.get<OrderResponse>(`/admin/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: number, statusData: UpdateOrderStatusRequest): Promise<OrderResponse> {
    return apiClient.put<OrderResponse>(`/admin/orders/${orderId}/status`, statusData);
  }

  async deleteOrder(orderId: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/admin/orders/${orderId}`);
  }

  // Order filtering and search
  async getOrdersByStatus(status: string): Promise<OrderResponse[]> {
    return apiClient.get<OrderResponse[]>(`/admin/orders?status=${status}`);
  }

  async getOrdersByUser(userId: number): Promise<OrderResponse[]> {
    return apiClient.get<OrderResponse[]>(`/admin/orders?userId=${userId}`);
  }

  async getOrdersByDateRange(startDate: string, endDate: string): Promise<OrderResponse[]> {
    return apiClient.get<OrderResponse[]>(`/admin/orders?startDate=${startDate}&endDate=${endDate}`);
  }

  // Order statistics (utility methods)
  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }> {
    try {
      const orders = await this.getAllOrders();
      
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => order.status === 'PENDING').length,
        processingOrders: orders.filter(order => order.status === 'PROCESSING').length,
        completedOrders: orders.filter(order => order.status === 'COMPLETED').length,
        totalRevenue: orders
          .filter(order => order.status === 'COMPLETED')
          .reduce((sum, order) => sum + order.finalTotal, 0),
      };
      
      return stats;
    } catch (error) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
      };
    }
  }

  // Recent orders
  async getRecentOrders(limit: number = 10): Promise<OrderResponse[]> {
    try {
      const orders = await this.getAllOrders();
      return orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  }

  // Order tracking
  async trackOrder(trackingNumber: string): Promise<OrderResponse | null> {
    try {
      const orders = await this.getAllOrders();
      return orders.find(order => order.trackingNumber === trackingNumber) || null;
    } catch (error) {
      return null;
    }
  }

  // Payment status update (if needed)
  async updatePaymentStatus(orderId: number, paymentStatus: string): Promise<OrderResponse> {
    return apiClient.put<OrderResponse>(`/admin/orders/${orderId}/payment-status`, { paymentStatus });
  }
}

// Create and export a singleton instance
export const orderService = new OrderService();
export default orderService;
