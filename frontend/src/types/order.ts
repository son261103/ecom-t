export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED';
export type PaymentMethod = 'VNPAY' | 'SEPAY' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderDetailResponse {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  productPrice: number;
  productDiscountPrice?: number;
  quantity: number;
  totalPrice: number;
  // Aliases for compatibility
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  userName: string;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingWard: string;
  shippingPostalCode?: string;
  recipientName: string;
  recipientPhone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  discountAmount: number;
  finalTotal: number;
  orderDetails: OrderDetailResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingWard: string;
  shippingPostalCode?: string;
  recipientName: string;
  recipientPhone: string;
  shippingPhone: string; // Add this
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}
