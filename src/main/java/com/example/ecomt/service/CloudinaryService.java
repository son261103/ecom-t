package com.example.ecomt.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload image to Cloudinary
     * 
     * @param file   MultipartFile to upload
     * @param folder Folder name in Cloudinary
     * @return Map containing upload result
     * @throws IOException if upload fails
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "image");

            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            log.info("Image uploaded successfully: {}", result.get("public_id"));
            return result;
        } catch (IOException e) {
            log.error("Error uploading image to Cloudinary: ", e);
            throw new IOException("Failed to upload image: " + e.getMessage());
        }
    }

    /**
     * Delete image from Cloudinary
     * 
     * @param publicId Public ID of the image to delete
     * @return Map containing deletion result
     * @throws IOException if deletion fails
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.trim().isEmpty()) {
            throw new IllegalArgumentException("Public ID cannot be null or empty");
        }

        try {
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted successfully: {}", publicId);
            return result;
        } catch (IOException e) {
            log.error("Error deleting image from Cloudinary: ", e);
            throw new IOException("Failed to delete image: " + e.getMessage());
        }
    }

    /**
     * Generate optimized image URL
     * 
     * @param publicId Public ID of the image
     * @param width    Width of the image
     * @param height   Height of the image
     * @return Optimized image URL
     */
    @SuppressWarnings("rawtypes")
    public String generateImageUrl(String publicId, Integer width, Integer height) {
        if (publicId == null || publicId.trim().isEmpty()) {
            return null;
        }

        Transformation transformation = new Transformation()
                .width(width)
                .height(height)
                .crop("fill")
                .quality("auto")
                .fetchFormat("auto");

        return cloudinary.url()
                .transformation(transformation)
                .generate(publicId);
    }

    /**
     * Generate simple image URL without transformation
     * 
     * @param publicId Public ID of the image
     * @return Simple image URL
     */
    @SuppressWarnings("rawtypes")
    public String generateImageUrl(String publicId) {
        if (publicId == null || publicId.trim().isEmpty()) {
            return null;
        }

        Transformation transformation = new Transformation()
                .quality("auto")
                .fetchFormat("auto");

        return cloudinary.url()
                .transformation(transformation)
                .generate(publicId);
    }
}
