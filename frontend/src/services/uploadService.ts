import { apiClient } from './api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    publicId: string;
    url: string;
    width: number;
    height: number;
    format?: string;
    resourceType?: string;
  };
}

export interface ImageUrlResponse {
  success: boolean;
  data: {
    publicId: string;
    url: string;
  };
}

export class UploadService {
  /**
   * Upload image to Cloudinary
   * @param file Image file to upload
   * @param folder Folder name in Cloudinary (default: 'general')
   * @returns Upload response with Cloudinary data
   */
  async uploadImage(file: File, folder: string = 'products'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return apiClient.post<UploadResponse>('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Delete image from Cloudinary
   * @param publicId Public ID of the image to delete
   * @returns Success response
   */
  async deleteImage(publicId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/admin/upload/image/${encodeURIComponent(publicId)}`);
  }

  /**
   * Generate optimized image URL
   * @param publicId Public ID of the image
   * @param width Optional width
   * @param height Optional height
   * @returns Image URL response
   */
  async generateImageUrl(publicId: string, width?: number, height?: number): Promise<ImageUrlResponse> {
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());

    const queryString = params.toString();
    const url = `/admin/upload/image-url/${encodeURIComponent(publicId)}${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<ImageUrlResponse>(url);
  }

  /**
   * Validate image file
   * @param file File to validate
   * @param maxSizeInMB Maximum size in MB (default: 10)
   * @returns Validation result
   */
  validateImageFile(file: File, maxSizeInMB: number = 10): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Vui lòng chọn file ảnh hợp lệ (PNG, JPG, GIF, WebP)' };
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return { isValid: false, error: `Kích thước file không được vượt quá ${maxSizeInMB}MB` };
    }

    // Check file dimensions (optional, you might want to check this on the client side)
    return { isValid: true };
  }

  /**
   * Create image preview URL from file
   * @param file Image file
   * @returns Promise that resolves to preview URL
   */
  createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to create preview'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// Create and export a singleton instance
export const uploadService = new UploadService();
export default uploadService;
