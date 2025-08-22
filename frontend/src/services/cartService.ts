import { apiClient } from './api';
import type {
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApiResponse,
} from '../types';

export class CartService {
  // Get user's cart
  async getCart(): Promise<CartResponse> {
    return apiClient.get<CartResponse>('/user/cart');
  }

  // Add item to cart
  async addToCart(request: AddToCartRequest): Promise<CartResponse> {
    return apiClient.post<CartResponse>('/user/cart/add', request);
  }

  // Update cart item quantity
  async updateCartItem(cartItemId: number, request: UpdateCartItemRequest): Promise<CartResponse> {
    return apiClient.put<CartResponse>(`/user/cart/items/${cartItemId}`, request);
  }

  // Remove item from cart
  async removeFromCart(cartItemId: number): Promise<CartResponse> {
    return apiClient.delete<CartResponse>(`/user/cart/items/${cartItemId}`);
  }

  // Clear entire cart
  async clearCart(): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>('/user/cart/clear');
  }

  // Get cart item count (utility method)
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalItems || 0;
    } catch (error) {
      return 0;
    }
  }

  // Get cart total (utility method)
  async getCartTotal(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalPrice || 0;
    } catch (error) {
      return 0;
    }
  }

  // Check if product is in cart (utility method)
  async isProductInCart(productId: number): Promise<boolean> {
    try {
      const cart = await this.getCart();
      return cart.items.some(item => item.productId === productId);
    } catch (error) {
      return false;
    }
  }

  // Get product quantity in cart (utility method)
  async getProductQuantityInCart(productId: number): Promise<number> {
    try {
      const cart = await this.getCart();
      const item = cart.items.find(item => item.productId === productId);
      return item ? item.quantity : 0;
    } catch (error) {
      return 0;
    }
  }

  // Update multiple cart items (batch update)
  async updateMultipleCartItems(updates: { cartItemId: number; quantity: number }[]): Promise<CartResponse> {
    // Since the backend doesn't have a batch update endpoint, we'll do sequential updates
    let cart: CartResponse | null = null;
    
    for (const update of updates) {
      cart = await this.updateCartItem(update.cartItemId, { quantity: update.quantity });
    }
    
    return cart || await this.getCart();
  }

  // Remove multiple cart items (batch remove)
  async removeMultipleFromCart(cartItemIds: number[]): Promise<CartResponse> {
    // Since the backend doesn't have a batch remove endpoint, we'll do sequential removes
    let cart: CartResponse | null = null;
    
    for (const cartItemId of cartItemIds) {
      cart = await this.removeFromCart(cartItemId);
    }
    
    return cart || await this.getCart();
  }
}

// Create and export a singleton instance
export const cartService = new CartService();
export default cartService;
