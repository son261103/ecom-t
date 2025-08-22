import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Grid,
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { categoryService } from '../../services';
import type { Category, CategoryRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const CategoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fetch categories
  const {
    data: categories,
    loading,
    execute: refetchCategories,
  } = useAsync<Category[]>(
    () => categoryService.getAdminCategories(),
    [],
    { immediate: true }
  );

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`)) {
      try {
        await categoryService.deleteCategory(categoryId);
        toast.success('Xóa danh mục thành công!');
        refetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Có lỗi xảy ra khi xóa danh mục');
      }
    }
  };

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải danh mục..." />
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
              Quản lý danh mục
            </h1>
            <p className="text-secondary-600">
              Quản lý tất cả danh mục sản phẩm trong hệ thống
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm danh mục mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Tổng danh mục</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {categories?.length || 0}
                  </p>
                </div>
                <Grid className="w-8 h-8 text-blue-500" />
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
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Grid className="w-24 h-24 text-secondary-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Không tìm thấy danh mục nào
              </h2>
              <p className="text-secondary-600 mb-8">
                {categories?.length === 0 
                  ? 'Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!'
                  : 'Thử thay đổi từ khóa tìm kiếm'
                }
              </p>
              {categories?.length === 0 && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Tạo danh mục đầu tiên
                </Button>
              )}
            </div>
          ) : (
            filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CategoryCard
                  category={category}
                  onEdit={() => setEditingCategory(category)}
                  onDelete={() => handleDeleteCategory(category.id, category.name)}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingCategory) && (
          <CategoryModal
            category={editingCategory}
            onClose={() => {
              setShowCreateModal(false);
              setEditingCategory(null);
            }}
            onSuccess={() => {
              setShowCreateModal(false);
              setEditingCategory(null);
              refetchCategories();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Category Card Component
interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <Card className="group cursor-pointer" hover>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {category.name.charAt(0).toUpperCase()}
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
          {category.name}
        </h3>
        
        <div className="text-sm text-secondary-600">
          <p>ID: #{category.id}</p>
          <p>Tạo: {formatDate(category.createdAt)}</p>
        </div>
      </div>
    </Card>
  );
};

// Category Modal Component
interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData: CategoryRequest = { name: name.trim() };
      
      if (isEdit) {
        await categoryService.updateCategory(category.id, categoryData);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await categoryService.createCategory(categoryData);
        toast.success('Tạo danh mục thành công!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Có lỗi xảy ra khi lưu danh mục');
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
                {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              
              <Input
                label="Tên danh mục"
                placeholder="Nhập tên danh mục"
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

export default CategoryManagement;
