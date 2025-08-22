import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Filter,
  Search,
  Grid,
  List,
  Star,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../components/ui';
import { useAsync, useDebounce } from '../hooks';
import { productService, categoryService, brandService } from '../services';
import type { ProductResponse, Category, Brand, ProductFilters } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../utils/constants';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    brandId: searchParams.get('brand') ? Number(searchParams.get('brand')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch products
  const {
    data: products,
    loading: productsLoading,
    } = useAsync<ProductResponse[]>(
    () => {
      if (debouncedSearchQuery) {
        return productService.searchProducts(debouncedSearchQuery);
      }
      return productService.getActiveProductsWithFilters(filters);
    },
    [debouncedSearchQuery, filters],
    { immediate: true }
  );

  // Apply client-side filtering for better UX
  const filteredProducts = products?.filter(product => {
    // Category filter
    if (filters.categoryId && product.category.id !== filters.categoryId) {
      return false;
    }

    // Brand filter
    if (filters.brandId && product.brand.id !== filters.brandId) {
      return false;
    }

    // Price range filter
    const price = product.discountPrice || product.price;
    if (filters.minPrice && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && price > filters.maxPrice) {
      return false;
    }

    return true;
  }) || [];

  // Fetch categories and brands for filters
  const { data: categories } = useAsync<Category[]>(
    () => categoryService.getAllCategories(),
    []
  );

  const { data: brands } = useAsync<Brand[]>(
    () => brandService.getAllBrands(),
    []
  );

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.categoryId) params.set('category', filters.categoryId.toString());
    if (filters.brandId) params.set('brand', filters.brandId.toString());
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    
    setSearchParams(params);
  }, [searchQuery, filters, setSearchParams]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
            Sản phẩm
          </h1>
          <p className="text-secondary-600">
            Khám phá bộ sưu tập đồ điện tử cao cấp của chúng tôi
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                fullWidth
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange({ sortBy: sortBy as any, sortOrder: sortOrder as any });
                }}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Mới nhất</option>
                <option value="createdAt-asc">Cũ nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-secondary-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600 hover:bg-secondary-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600 hover:bg-secondary-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="w-4 h-4" />}
              >
                Bộ lọc
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-secondary-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={filters.categoryId || ''}
                    onChange={(e) => handleFilterChange({ 
                      categoryId: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Thương hiệu
                  </label>
                  <select
                    value={filters.brandId || ''}
                    onChange={(e) => handleFilterChange({ 
                      brandId: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands?.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Giá từ
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange({ 
                      minPrice: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Giá đến
                  </label>
                  <input
                    type="number"
                    placeholder="Không giới hạn"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange({ 
                      maxPrice: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Đang tải sản phẩm..." />
          </div>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-secondary-600 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
            <Button onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-secondary-600">
                Tìm thấy <span className="font-medium text-secondary-900">{filteredProducts.length}</span> sản phẩm
              </p>
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {viewMode === 'grid' ? (
                    <ProductCard product={product} />
                  ) : (
                    <ProductListItem product={product} />
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Product Card Component for Grid View
const ProductCard: React.FC<{ product: ProductResponse }> = ({ product }) => {
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
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Hết hàng</span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-medium text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
              {product.name}
            </h3>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-secondary-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-secondary-500 ml-2">(4.0)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
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
        </div>
      </Link>
      
      {/* Action Buttons */}
      <div className="p-4 pt-0">
        <Button
          size="sm"
          fullWidth
          disabled={product.stockQuantity === 0}
          icon={<ShoppingCart className="w-4 h-4" />}
        >
          Thêm vào giỏ
        </Button>
      </div>
    </Card>
  );
};

// Product List Item Component for List View
const ProductListItem: React.FC<{ product: ProductResponse }> = ({ product }) => {
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer overflow-hidden" hover>
      <div className="flex">
        <Link to={`${ROUTES.PRODUCTS}/${product.id}`} className="flex-1 flex">
          <div className="relative w-32 h-32 flex-shrink-0">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{discountPercentage}%
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="font-medium text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
              {product.name}
            </h3>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-secondary-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-secondary-500 ml-2">(4.0)</span>
            </div>
            
            <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                {product.discountPrice ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-red-600">
                      {formatCurrency(product.discountPrice)}
                    </span>
                    <span className="text-sm text-secondary-500 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-secondary-900">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={product.stockQuantity === 0}
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  Thêm vào giỏ
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default ProductsPage;
