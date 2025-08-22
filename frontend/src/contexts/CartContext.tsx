import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { cartService } from '../services';
import { useAuth } from './AuthContext';
import type {
  CartContextType,
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Add small delay to ensure token is properly set
      const timer = setTimeout(() => {
        refreshCart();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      // Handle specific error cases
      if (error.response?.status === 403) {
        console.log('Cart access denied - user may not have cart yet');
      } else if (error.response?.status === 401) {
        console.log('Cart fetch unauthorized - token may be invalid');
      }
      // Don't show error toast for cart fetch failures, just set to null
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (request: AddToCartRequest): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartService.addToCart(request);
      setCart(updatedCart);
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (
    cartItemId: number,
    request: UpdateCartItemRequest
  ): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để cập nhật giỏ hàng');
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartService.updateCartItem(cartItemId, request);
      setCart(updatedCart);
      toast.success('Đã cập nhật giỏ hàng!');
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng');
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartService.removeFromCart(cartItemId);
      setCart(updatedCart);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xóa giỏ hàng');
      return;
    }

    try {
      setIsLoading(true);
      await cartService.clearCart();
      setCart(null);
      toast.success('Đã xóa tất cả sản phẩm trong giỏ hàng!');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    isLoading,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
