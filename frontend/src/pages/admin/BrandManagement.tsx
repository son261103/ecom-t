import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { brandService } from '../../services';
import type { Brand, BrandRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const BrandManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Fetch brands
  const {
    data: brands,
    loading,
    execute: refetchBrands,
  } = useAsync<Brand[]>(
    () => brandService.getAdminBrands(),
    [],
    { immediate: true }
  );

  const handleDeleteBrand = async (brandId: number, brandName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brandName}"?`)) {
      try {
        await brandService.deleteBrand(brandId);
        toast.success('Xóa thương hiệu thành công!');
        refetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        toast.error('Có lỗi xảy ra khi xóa thương hiệu');
      }
    }
  };

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải thương hiệu..." />
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
              Quản lý thương hiệu
            </h1>
            <p className="text-secondary-600">
              Quản lý tất cả thương hiệu sản phẩm trong hệ thống
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm thương hiệu mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Tổng thương hiệu</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {brands?.length || 0}
                  </p>
                </div>
                <Tag className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="max-w-md">
              <Input
                type="text"
                placeholder="Tìm kiếm thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Tag className="w-24 h-24 text-secondary-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Không tìm thấy thương hiệu nào
              </h2>
              <p className="text-secondary-600 mb-8">
                {brands?.length === 0 
                  ? 'Chưa có thương hiệu nào. Hãy tạo thương hiệu đầu tiên!'
                  : 'Thử thay đổi từ khóa tìm kiếm'
                }
              </p>
              {brands?.length === 0 && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Tạo thương hiệu đầu tiên
                </Button>
              )}
            </div>
          ) : (
            filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BrandCard
                  brand={brand}
                  onEdit={() => setEditingBrand(brand)}
                  onDelete={() => handleDeleteBrand(brand.id, brand.name)}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingBrand) && (
          <BrandModal
            brand={editingBrand}
            onClose={() => {
              setShowCreateModal(false);
              setEditingBrand(null);
            }}
            onSuccess={() => {
              setShowCreateModal(false);
              setEditingBrand(null);
              refetchBrands();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Brand Card Component
interface BrandCardProps {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onEdit, onDelete }) => {
  return (
    <Card className="group cursor-pointer" hover>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          {brand.name}
        </h3>
        
        <div className="text-sm text-secondary-600">
          <p>ID: #{brand.id}</p>
          <p>Tạo: {formatDate(brand.createdAt)}</p>
        </div>
      </div>
    </Card>
  );
};

// Brand Modal Component
interface BrandModalProps {
  brand: Brand | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BrandModal: React.FC<BrandModalProps> = ({ brand, onClose, onSuccess }) => {
  const [name, setName] = useState(brand?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!brand;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tên thương hiệu không được để trống');
      return;
    }

    setIsSubmitting(true);
    try {
      const brandData: BrandRequest = { name: name.trim() };
      
      if (isEdit) {
        await brandService.updateBrand(brand.id, brandData);
        toast.success('Cập nhật thương hiệu thành công!');
      } else {
        await brandService.createBrand(brandData);
        toast.success('Tạo thương hiệu thành công!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error('Có lỗi xảy ra khi lưu thương hiệu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">
                {isEdit ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
              </h3>
              
              <Input
                label="Tên thương hiệu"
                placeholder="Nhập tên thương hiệu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                autoFocus
              />
            </div>
            
            <div className="bg-secondary-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full sm:w-auto sm:ml-3"
              >
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandManagement;
