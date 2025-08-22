export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  productPrice: number;
  productDiscountPrice?: number;
  quantity: number;
  totalPrice: number;
  // Alias for compatibility
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  variantId?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartContextType {
  cart: CartResponse | null;
  addToCart: (request: AddToCartRequest) => Promise<void>;
  updateCartItem: (cartItemId: number, request: UpdateCartItemRequest) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}
