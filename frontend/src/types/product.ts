export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
}

export interface BrandInfo {
  id: number;
  name: string;
}

export interface ProductVariantResponse {
  id: number;
  name: string;
  value: string;
  price?: number;
  stockQuantity?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  image?: string;
  stockQuantity: number;
  isActive: boolean;
  category: CategoryInfo;
  brand: BrandInfo;
  variants?: ProductVariantResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  image?: string;
  cloudinaryPublicId?: string;
  stockQuantity?: number;
  isActive?: boolean;
  categoryId?: number;
  brandId?: number;
}

export interface CategoryRequest {
  name: string;
}

export interface BrandRequest {
  name: string;
}

export interface ProductFilters {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
