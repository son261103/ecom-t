import React from "react";
import { Upload, X, Trash2 } from "lucide-react";
import { Loading } from "../ui";
import { useImageUpload } from "../../hooks";

interface ImageUploadProps {
  value?: string;
  cloudinaryPublicId?: string;
  onChange: (imageUrl?: string, cloudinaryPublicId?: string) => void;
  folder?: string;
  maxSizeInMB?: number;
  className?: string;
  label?: string;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  cloudinaryPublicId,
  onChange,
  folder = "products",
  maxSizeInMB = 10,
  className = "",
  label = "Hình ảnh",
  error,
}) => {
  const imageUpload = useImageUpload(maxSizeInMB, false, folder);

  // Initialize with existing image
  React.useEffect(() => {
    if (value && !imageUpload.state.previewUrl) {
      imageUpload.setPreviewFromUrl(value, cloudinaryPublicId);
    }
  }, [value, cloudinaryPublicId, imageUpload]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageUpload.handleFileSelect(file);
    }
  };

  // Handle upload and notify parent
  const handleUpload = async () => {
    const uploadedData = await imageUpload.handleUpload(folder);
    if (uploadedData) {
      onChange(uploadedData.url, uploadedData.publicId);
    }
  };

  // Handle delete and notify parent
  const handleDelete = async () => {
    await imageUpload.handleDelete();
    onChange(undefined, undefined);
  };

  // Handle remove (without deleting from Cloudinary)
  const handleRemove = () => {
    imageUpload.resetState();
    onChange(undefined, undefined);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-4">
        {imageUpload.state.previewUrl ? (
          <div className="relative">
            <img
              src={imageUpload.state.previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="absolute top-2 right-2 flex space-x-2">
              {imageUpload.state.uploadedImage && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  title="Xóa ảnh khỏi Cloudinary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
                title="Bỏ chọn ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {imageUpload.state.isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <Loading size="md" text="Đang upload..." />
              </div>
            )}

            {imageUpload.state.uploadedImage && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                ✓ Đã upload
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600 mb-2">
              Kéo thả ảnh vào đây hoặc click để chọn
            </p>
            <p className="text-sm text-secondary-500">
              PNG, JPG, GIF tối đa {maxSizeInMB}MB
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {imageUpload.state.error && (
          <p className="text-red-600 text-sm">{imageUpload.state.error}</p>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {imageUpload.state.previewUrl && !imageUpload.state.uploadedImage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm mb-2">
              ⚠️ Ảnh chưa được upload lên Cloudinary
            </p>
            <button
              type="button"
              onClick={handleUpload}
              disabled={imageUpload.state.isUploading}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {imageUpload.state.isUploading ? "Đang upload..." : "Upload ngay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
