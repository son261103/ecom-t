import { apiClient } from './api';
import type {
  Brand,
  BrandRequest,
  ApiResponse,
} from '../types';

export class BrandService {
  // Public brand endpoints
  async getAllBrands(): Promise<Brand[]> {
    return apiClient.get<Brand[]>('/brands');
  }

  async getBrandById(id: number): Promise<Brand> {
    return apiClient.get<Brand>(`/brands/${id}`);
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

  // Utility methods
  async searchBrands(query: string): Promise<Brand[]> {
    const brands = await this.getAllBrands();
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getBrandStats(): Promise<{
    totalBrands: number;
    activeBrands: number;
  }> {
    try {
      const brands = await this.getAdminBrands();
      return {
        totalBrands: brands.length,
        activeBrands: brands.length, // All brands are active by default
      };
    } catch (error) {
      return {
        totalBrands: 0,
        activeBrands: 0,
      };
    }
  }

  // Get popular brands (you might want to add this endpoint to backend)
  async getPopularBrands(limit: number = 6): Promise<Brand[]> {
    const brands = await this.getAllBrands();
    return brands.slice(0, limit);
  }
}

// Create and export a singleton instance
export const brandService = new BrandService();
export default brandService;
