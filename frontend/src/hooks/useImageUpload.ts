import { useState, useCallback } from 'react';
import { uploadService, type UploadResponse } from '../services/uploadService';
import { toast } from 'react-hot-toast';

export interface ImageUploadState {
  isUploading: boolean;
  uploadedImage: UploadResponse['data'] | null;
  previewUrl: string | null;
  error: string | null;
}

export interface UseImageUploadReturn {
  state: ImageUploadState;
  handleFileSelect: (file: File | null) => Promise<void>;
  handleUpload: (folder?: string) => Promise<UploadResponse['data'] | null>;
  handleDelete: () => Promise<void>;
  resetState: () => void;
  setPreviewFromUrl: (url: string, publicId?: string) => void;
}

export const useImageUpload = (
  maxSizeInMB: number = 10,
  autoUpload: boolean = false,
  defaultFolder: string = 'products'
): UseImageUploadReturn => {
  const [state, setState] = useState<ImageUploadState>({
    isUploading: false,
    uploadedImage: null,
    previewUrl: null,
    error: null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      uploadedImage: null,
      previewUrl: null,
      error: null,
    });
    setSelectedFile(null);
  }, []);

  const setPreviewFromUrl = useCallback((url: string, publicId?: string) => {
    setState(prev => ({
      ...prev,
      previewUrl: url,
      uploadedImage: publicId ? {
        publicId,
        url,
        width: 0,
        height: 0,
      } : null,
      error: null,
    }));
  }, []);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      resetState();
      return;
    }

    // Validate file
    const validation = uploadService.validateImageFile(file, maxSizeInMB);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Invalid file',
        previewUrl: null,
        uploadedImage: null,
      }));
      toast.error(validation.error || 'Invalid file');
      return;
    }

    try {
      // Create preview
      const previewUrl = await uploadService.createPreviewUrl(file);
      setSelectedFile(file);
      setState(prev => ({
        ...prev,
        previewUrl,
        error: null,
        uploadedImage: null, // Reset uploaded image when new file is selected
      }));

      // Auto upload if enabled
      if (autoUpload) {
        await handleUpload(defaultFolder);
      }
    } catch (error) {
      const errorMessage = 'Không thể tạo preview cho ảnh';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        previewUrl: null,
      }));
      toast.error(errorMessage);
    }
  }, [maxSizeInMB, autoUpload, defaultFolder]);

  const handleUpload = useCallback(async (folder: string = defaultFolder): Promise<UploadResponse['data'] | null> => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file để upload');
      return null;
    }

    setState(prev => ({ ...prev, isUploading: true, error: null }));

    try {
      const response = await uploadService.uploadImage(selectedFile, folder);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          isUploading: false,
          uploadedImage: response.data,
          previewUrl: response.data.url,
          error: null,
        }));
        toast.success('Upload ảnh thành công!');
        return response.data;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi upload ảnh';
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return null;
    }
  }, [selectedFile, defaultFolder]);

  const handleDelete = useCallback(async () => {
    if (!state.uploadedImage?.publicId) {
      toast.error('Không có ảnh để xóa');
      return;
    }

    try {
      await uploadService.deleteImage(state.uploadedImage.publicId);
      resetState();
      toast.success('Xóa ảnh thành công!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa ảnh';
      toast.error(errorMessage);
    }
  }, [state.uploadedImage?.publicId, resetState]);

  return {
    state,
    handleFileSelect,
    handleUpload,
    handleDelete,
    resetState,
    setPreviewFromUrl,
  };
};

export default useImageUpload;
