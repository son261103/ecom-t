import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { productService } from '../../services';
import type { ProductResponse, ProductFilters } from '../../types';
import { formatCurrency, formatDate } from '../../utils';
import { ROUTES } from '../../utils';
import { toast } from 'react-hot-toast';

const ProductManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products
  const {
    data: products,
    loading,
    execute: refetchProducts,
  } = useAsync<ProductResponse[]>(
    () => {
      if (searchQuery) {
        return productService.searchProducts(searchQuery);
      }
      return productService.getAllProducts();
    },
    [searchQuery],
    { immediate: true }
  );

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      try {
        await productService.deleteProduct(productId);
        toast.success('Xóa sản phẩm thành công!');
        refetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Có lỗi xảy ra khi xóa sản phẩm');
      }
    }
  };

  const filteredProducts = products?.filter(product => {
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải sản phẩm..." />
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
              Quản lý sản phẩm
            </h1>
            <p className="text-secondary-600">
              Quản lý tất cả sản phẩm trong hệ thống
            </p>
          </div>
          <Link to="/admin/products/create">
            <Button icon={<Plus className="w-4 h-4" />}>
              Thêm sản phẩm mới
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {products?.length || 0}
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
                  <p className="text-sm text-secondary-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products?.filter(p => p.isActive).length || 0}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Hết hàng</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products?.filter(p => p.stockQuantity === 0).length || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Sắp hết hàng</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {products?.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length || 0}
                  </p>
                </div>
                <Package className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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
              
              <div className="flex items-center gap-4">
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
                  }}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="createdAt-desc">Mới nhất</option>
                  <option value="createdAt-asc">Cũ nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="w-4 h-4" />}
                >
                  Bộ lọc
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-secondary-500">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-secondary-900 line-clamp-2">
                              {product.name}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {product.brand.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {formatCurrency(product.discountPrice || product.price)}
                        </div>
                        {product.discountPrice && (
                          <div className="text-sm text-secondary-500 line-through">
                            {formatCurrency(product.price)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stockQuantity === 0 
                            ? 'bg-red-100 text-red-800'
                            : product.stockQuantity < 10
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link to={`${ROUTES.PRODUCTS}/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
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

export default ProductManagement;
