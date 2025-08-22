import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../../components/ui';
import { useAsync } from '../../hooks';
import { productService, categoryService, brandService } from '../../services';
import type { ProductRequest, Category, Brand } from '../../types';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự')
    .max(255, 'Tên sản phẩm không được quá 255 ký tự')
    .required('Tên sản phẩm là bắt buộc'),
  price: yup
    .number()
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
    .required('Giá là bắt buộc'),
  discountPrice: yup
    .number()
    .min(0, 'Giá giảm phải lớn hơn hoặc bằng 0')
    .optional()
    .test('discount-less-than-price', 'Giá giảm phải nhỏ hơn giá gốc', function(value) {
      const { price } = this.parent;
      if (value && price) {
        return value < price;
      }
      return true;
    }),
  description: yup
    .string()
    .max(1000, 'Mô tả không được quá 1000 ký tự')
    .optional(),
  stockQuantity: yup
    .number()
    .min(0, 'Số lượng phải lớn hơn hoặc bằng 0')
    .integer('Số lượng phải là số nguyên')
    .required('Số lượng là bắt buộc'),
  categoryId: yup
    .number()
    .required('Danh mục là bắt buộc'),
  brandId: yup
    .number()
    .required('Thương hiệu là bắt buộc'),
  isActive: yup
    .boolean()
    .required(),
});

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch categories and brands
  const { data: categories } = useAsync<Category[]>(
    () => categoryService.getAdminCategories(),
    []
  );

  const { data: brands } = useAsync<Brand[]>(
    () => brandService.getAdminBrands(),
    []
  );

  // Fetch product for editing
  const { data: product, loading: productLoading } = useAsync(
    () => isEdit ? productService.getProductById(Number(id)) : Promise.resolve(null),
    [id, isEdit]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      isActive: true,
      stockQuantity: 0,
    },
  });

  // Reset form when product data is loaded
  useEffect(() => {
    if (product && isEdit) {
      reset({
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || undefined,
        description: product.description || '',
        stockQuantity: product.stockQuantity,
        categoryId: product.category.id,
        brandId: product.brand.id,
        isActive: product.isActive,
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product, isEdit, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const onSubmit = async (data: ProductRequest) => {
    setIsSubmitting(true);
    try {
      // Handle image upload if there's a new image
      let imageUrl = product?.image || '';
      if (imageFile) {
        // In a real app, you would upload to a service like Cloudinary
        // For now, we'll use a placeholder
        imageUrl = imagePreview;
      }

      const productData: ProductRequest = {
        ...data,
        image: imageUrl || undefined,
      };

      if (isEdit) {
        await productService.updateProduct(Number(id), productData);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await productService.createProduct(productData);
        toast.success('Tạo sản phẩm thành công!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/products')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900">
                {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h1>
              <p className="text-secondary-600">
                {isEdit ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới trong hệ thống'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                    Thông tin cơ bản
                  </h2>
                  
                  <div className="space-y-4">
                    <Input
                      {...register('name')}
                      label="Tên sản phẩm"
                      placeholder="Nhập tên sản phẩm"
                      error={errors.name?.message}
                      fullWidth
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        {...register('price', { valueAsNumber: true })}
                        type="number"
                        label="Giá gốc (VNĐ)"
                        placeholder="0"
                        error={errors.price?.message}
                        fullWidth
                      />
                      <Input
                        {...register('discountPrice', { valueAsNumber: true })}
                        type="number"
                        label="Giá giảm (VNĐ)"
                        placeholder="0"
                        error={errors.discountPrice?.message}
                        fullWidth
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Mô tả sản phẩm
                      </label>
                      <textarea
                        {...register('description')}
                        rows={4}
                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Danh mục
                        </label>
                        <select
                          {...register('categoryId', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Chọn danh mục</option>
                          {categories?.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && (
                          <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Thương hiệu
                        </label>
                        <select
                          {...register('brandId', { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Chọn thương hiệu</option>
                          {brands?.map(brand => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        {errors.brandId && (
                          <p className="mt-1 text-xs text-red-600">{errors.brandId.message}</p>
                        )}
                      </div>
                    </div>

                    <Input
                      {...register('stockQuantity', { valueAsNumber: true })}
                      type="number"
                      label="Số lượng tồn kho"
                      placeholder="0"
                      error={errors.stockQuantity?.message}
                      fullWidth
                    />
                  </div>
                </div>
              </Card>

              {/* Product Image */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                    Hình ảnh sản phẩm
                  </h2>
                  
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                        <p className="text-secondary-600 mb-2">
                          Kéo thả ảnh vào đây hoặc click để chọn
                        </p>
                        <p className="text-sm text-secondary-500">
                          PNG, JPG, GIF tối đa 5MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                    Trạng thái
                  </h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        {...register('isActive')}
                        type="checkbox"
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-secondary-700">
                        Kích hoạt sản phẩm
                      </span>
                    </label>
                    <p className="text-xs text-secondary-500">
                      Sản phẩm sẽ hiển thị trên website khi được kích hoạt
                    </p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      fullWidth
                      icon={<Save className="w-4 h-4" />}
                    >
                      {isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => navigate('/admin/products')}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Product Info */}
              {isEdit && product && (
                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                      Thông tin sản phẩm
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600">ID:</span>
                        <span className="font-medium">#{product.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Tạo lúc:</span>
                        <span className="font-medium">
                          {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Cập nhật:</span>
                        <span className="font-medium">
                          {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
