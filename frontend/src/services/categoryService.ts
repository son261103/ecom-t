import { apiClient } from './api';
import type {
  Category,
  CategoryRequest,
  ApiResponse,
} from '../types';

export class CategoryService {
  // Public category endpoints
  async getAllCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  }

  async getCategoryById(id: number): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
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

  // Utility methods
  async searchCategories(query: string): Promise<Category[]> {
    const categories = await this.getAllCategories();
    return categories.filter(category => 
      category.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
  }> {
    try {
      const categories = await this.getAdminCategories();
      return {
        totalCategories: categories.length,
        activeCategories: categories.length, // All categories are active by default
      };
    } catch (error) {
      return {
        totalCategories: 0,
        activeCategories: 0,
      };
    }
  }
}

// Create and export a singleton instance
export const categoryService = new CategoryService();
export default categoryService;
