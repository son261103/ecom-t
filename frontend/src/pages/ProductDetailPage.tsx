import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,

} from 'lucide-react';
import { Card, Button, Loading } from '../components/ui';
import { useAsync } from '../hooks';
import { useAuth, useCart } from '../contexts';
import { productService } from '../services';
import type { ProductResponse } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../utils/constants';
import { toast } from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product details
  const {
    data: product,
    loading,
    error,
  } = useAsync<ProductResponse>(
    () => productService.getActiveProductById(Number(id)),
    [id]
  );

  // Fetch related products
  const {
    data: relatedProducts,
  } = useAsync<ProductResponse[]>(
    () => product ? productService.getActiveProductsWithFilters({ 
      categoryId: product.category.id,
      limit: 4 
    }) : Promise.resolve([]),
    [product]
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!product) return;

    try {
      await addToCart({
        productId: product.id,
        quantity,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate(ROUTES.CART);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-secondary-600 mb-6">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button>Quay lại danh sách sản phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const images = product.image ? [product.image] : [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
          <Link to={ROUTES.HOME} className="hover:text-primary-600">Trang chủ</Link>
          <span>/</span>
          <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600">Sản phẩm</Link>
          <span>/</span>
          <Link to={`${ROUTES.CATEGORIES}/${product.category.id}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-secondary-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="relative aspect-square">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-medium">
                    -{discountPercentage}%
                  </div>
                )}
                {product.stockQuantity === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xl font-medium">Hết hàng</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary-600' : 'border-secondary-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-secondary-300'}`}
                    />
                  ))}
                </div>
                <span className="text-secondary-600 ml-2">(4.0 - 128 đánh giá)</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {formatCurrency(product.discountPrice)}
                    </span>
                    <span className="text-xl text-secondary-500 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-secondary-900">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-secondary-600">Thương hiệu:</span>
                <Link 
                  to={`${ROUTES.BRANDS}/${product.brand.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {product.brand.name}
                </Link>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-secondary-600">Tình trạng:</span>
                <span className={`font-medium ${
                  product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-secondary-700 font-medium">Số lượng:</span>
                <div className="flex items-center border border-secondary-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stockQuantity}
                    className="p-2 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  icon={<ShoppingCart className="w-5 h-5" />}
                  className="flex-1"
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className="flex-1"
                >
                  Mua ngay
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button variant="ghost" icon={<Share2 className="w-5 h-5" />}>
                  Chia sẻ
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-secondary-600">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-600">
                <Truck className="w-5 h-5 text-primary-600" />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-600">
                <RotateCcw className="w-5 h-5 text-primary-600" />
                <span>Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <Card className="mb-12">
          <div className="p-6">
            <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
              Mô tả sản phẩm
            </h2>
            <div className="prose max-w-none text-secondary-700">
              {product.description ? (
                <p className="leading-relaxed">{product.description}</p>
              ) : (
                <p className="leading-relaxed">
                  {product.name} là một sản phẩm chất lượng cao từ thương hiệu {product.brand.name}. 
                  Sản phẩm được thiết kế với công nghệ tiên tiến, mang lại trải nghiệm tuyệt vời cho người dùng.
                  Với chất lượng đảm bảo và giá cả hợp lý, đây là lựa chọn hoàn hảo cho bạn.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RelatedProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Related Product Card Component
const RelatedProductCard: React.FC<{ product: ProductResponse }> = ({ product }) => {
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer overflow-hidden h-full flex flex-col" hover>
      <Link to={`${ROUTES.PRODUCTS}/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{discountPercentage}%
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
          
          <div className="mt-auto">
            {product.discountPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(product.discountPrice)}
                </span>
                <span className="text-sm text-secondary-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-secondary-900">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ProductDetailPage;
