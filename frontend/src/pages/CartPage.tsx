import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { Card, Button, Loading } from '../components/ui';
import { useAuth, useCart } from '../contexts';
import type { CartItemResponse } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../utils/constants';


const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart, isLoading } = useCart();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Vui lòng đăng nhập
          </h2>
          <p className="text-secondary-600 mb-6">
            Bạn cần đăng nhập để xem giỏ hàng của mình
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await updateCartItem(itemId, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải giỏ hàng..." />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="container-custom py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-secondary-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-secondary-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg" icon={<ShoppingBag className="w-5 h-5" />}>
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-secondary-600">
              {cart.totalItems} sản phẩm trong giỏ hàng
            </p>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Sản phẩm ({cart.totalItems})
                  </h2>
                  {cart.items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCart}
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CartItem
                          item={item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemoveItem}
                          isUpdating={updatingItems.has(item.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Tạm tính:</span>
                    <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Giảm giá:</span>
                    <span className="font-medium">-{formatCurrency(0)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary-600">{formatCurrency(cart.totalPrice)}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Mã giảm giá"
                      className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button variant="outline" icon={<Tag className="w-4 h-4" />}>
                      Áp dụng
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  icon={<ShoppingCart className="w-5 h-5" />}
                >
                  Thanh toán
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-secondary-500">
                    Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
interface CartItemProps {
  item: CartItemResponse;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  isUpdating,
}) => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg">
      {/* Product Image */}
      <Link to={`${ROUTES.PRODUCTS}/${item.productId}`} className="flex-shrink-0">
        <img
          src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`${ROUTES.PRODUCTS}/${item.productId}`}
          className="font-medium text-secondary-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2"
        >
          {item.productName}
        </Link>
        <p className="text-lg font-bold text-primary-600 mt-1">
          {formatCurrency(item.productPrice)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1 || isUpdating}
          className="p-1 rounded-full hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="w-12 text-center font-medium">
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            item.quantity
          )}
        </span>
        
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          disabled={isUpdating}
          className="p-1 rounded-full hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-bold text-secondary-900">
          {formatCurrency(item.subtotal)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
        title="Xóa sản phẩm"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartPage;
