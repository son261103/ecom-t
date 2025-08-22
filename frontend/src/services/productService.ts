import { apiClient } from './api';
import type {
  ProductResponse,
  ProductRequest,
  Category,
  Brand,
  CategoryRequest,
  BrandRequest,
  ProductFilters,
  ApiResponse,
} from '../types';

export class ProductService {
  // Public product endpoints
  async getAllActiveProducts(): Promise<ProductResponse[]> {
    return apiClient.get<ProductResponse[]>('/products');
  }

  async getActiveProductById(id: number): Promise<ProductResponse> {
    return apiClient.get<ProductResponse>(`/products/${id}`);
  }

  async getActiveProductsWithFilters(filters: ProductFilters): Promise<ProductResponse[]> {
    const params = new URLSearchParams();
    
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.brandId) params.append('brandId', filters.brandId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.name) params.append('name', filters.name);

    return apiClient.get<ProductResponse[]>(`/products/filter?${params.toString()}`);
  }

  // Public category endpoints
  async getAllCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  }

  async getCategoryById(id: number): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  }

  // Public brand endpoints
  async getAllBrands(): Promise<Brand[]> {
    return apiClient.get<Brand[]>('/brands');
  }

  async getBrandById(id: number): Promise<Brand> {
    return apiClient.get<Brand>(`/brands/${id}`);
  }

  // Admin product endpoints
  async getAllProducts(): Promise<ProductResponse[]> {
    return apiClient.get<ProductResponse[]>('/admin/products');
  }

  async getProductById(id: number): Promise<ProductResponse> {
    return apiClient.get<ProductResponse>(`/admin/products/${id}`);
  }

  async getProductsWithFilters(filters: ProductFilters): Promise<ProductResponse[]> {
    const params = new URLSearchParams();
    
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.brandId) params.append('brandId', filters.brandId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.name) params.append('name', filters.name);

    return apiClient.get<ProductResponse[]>(`/admin/products/filter?${params.toString()}`);
  }

  async createProduct(productData: ProductRequest): Promise<ProductResponse> {
    return apiClient.post<ProductResponse>('/admin/products/json', productData);
  }

  async updateProduct(id: number, productData: ProductRequest): Promise<ProductResponse> {
    return apiClient.put<ProductResponse>(`/admin/products/json/${id}`, productData);
  }

  /**
   * Create product with image upload (multipart form data)
   * @param productData Product data
   * @param imageFile Optional image file
   * @returns Created product
   */
  async createProductWithImage(productData: ProductRequest, imageFile?: File): Promise<ProductResponse> {
    const formData = new FormData();
    formData.append('productData', JSON.stringify(productData));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return apiClient.post<ProductResponse>('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Update product with image upload (multipart form data)
   * @param id Product ID
   * @param productData Product data
   * @param imageFile Optional image file
   * @returns Updated product
   */
  async updateProductWithImage(id: number, productData: ProductRequest, imageFile?: File): Promise<ProductResponse> {
    const formData = new FormData();
    formData.append('productData', JSON.stringify(productData));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return apiClient.put<ProductResponse>(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/admin/products/${id}`);
  }

  // Admin category endpoints
  async getAdminCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/admin/categories');
  }

  async getAdminCategoryById(id: number): Promise<Category> {
    return apiClient.get<Category>(`/admin/categories/${id}`);
  }

  async createCategory(categoryData: CategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/admin/categories', categoryData);
  }

  async updateCategory(id: number, categoryData: CategoryRequest): Promise<Category> {
    return apiClient.put<Category>(`/admin/categories/${id}`, categoryData);
  }

  async deleteCategory(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/admin/categories/${id}`);
  }

  // Admin brand endpoints
  async getAdminBrands(): Promise<Brand[]> {
    return apiClient.get<Brand[]>('/admin/brands');
  }

  async getAdminBrandById(id: number): Promise<Brand> {
    return apiClient.get<Brand>(`/admin/brands/${id}`);
  }

  async createBrand(brandData: BrandRequest): Promise<Brand> {
    return apiClient.post<Brand>('/admin/brands', brandData);
  }

  async updateBrand(id: number, brandData: BrandRequest): Promise<Brand> {
    return apiClient.put<Brand>(`/admin/brands/${id}`, brandData);
  }

  async deleteBrand(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/admin/brands/${id}`);
  }

  // Search functionality
  async searchProducts(query: string): Promise<ProductResponse[]> {
    return apiClient.get<ProductResponse[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Featured products (you might want to add this endpoint to backend)
  async getFeaturedProducts(limit: number = 8): Promise<ProductResponse[]> {
    return apiClient.get<ProductResponse[]>(`/products?limit=${limit}&featured=true`);
  }

  // Latest products
  async getLatestProducts(limit: number = 8): Promise<ProductResponse[]> {
    return apiClient.get<ProductResponse[]>(`/products?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
  }
}

// Create and export a singleton instance
export const productService = new ProductService();
export default productService;
