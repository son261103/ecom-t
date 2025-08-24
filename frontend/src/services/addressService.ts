import type { Province, District, Ward } from '../types';

const BASE_URL = 'https://provinces.open-api.vn/api/v1';

export class AddressService {
  // Get all provinces
  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${BASE_URL}/p`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  }

  // Get province details with districts and wards
  async getProvinceDetails(provinceCode: number): Promise<Province | null> {
    try {
      const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch province details');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching province details:', error);
      return null;
    }
  }

}

// Create and export a singleton instance
export const addressService = new AddressService();
export default addressService;
