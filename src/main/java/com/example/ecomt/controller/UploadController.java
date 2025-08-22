package com.example.ecomt.controller;

import com.example.ecomt.dto.ApiResponse;
import com.example.ecomt.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
@Tag(name = "Admin - Upload Management", description = "File upload APIs for Admin")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload image", description = "Upload image to Cloudinary")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        try {
            if (imageFile == null || imageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Image file is required"));
            }

            // Validate file type
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only image files are allowed"));
            }

            // Validate file size (max 10MB)
            if (imageFile.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File size must be less than 10MB"));
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(imageFile, folder);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Image uploaded successfully",
                    "data", Map.of(
                            "publicId", uploadResult.get("public_id"),
                            "url", uploadResult.get("secure_url"),
                            "width", uploadResult.get("width"),
                            "height", uploadResult.get("height"),
                            "format", uploadResult.get("format"),
                            "resourceType", uploadResult.get("resource_type")));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading image: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    @DeleteMapping("/image/{publicId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete image", description = "Delete image from Cloudinary")
    public ResponseEntity<?> deleteImage(@PathVariable String publicId) {
        try {
            Map<String, Object> result = cloudinaryService.deleteImage(publicId);

            String resultStatus = (String) result.get("result");
            if ("ok".equals(resultStatus)) {
                return ResponseEntity.ok(ApiResponse.success("Image deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Failed to delete image: " + resultStatus));
            }
        } catch (Exception e) {
            log.error("Error deleting image: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete image: " + e.getMessage()));
        }
    }

    @GetMapping("/image-url/{publicId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate image URL", description = "Generate optimized image URL from Cloudinary")
    public ResponseEntity<?> generateImageUrl(
            @PathVariable String publicId,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height) {
        try {
            String imageUrl;
            if (width != null && height != null) {
                imageUrl = cloudinaryService.generateImageUrl(publicId, width, height);
            } else {
                imageUrl = cloudinaryService.generateImageUrl(publicId);
            }

            if (imageUrl != null) {
                Map<String, Object> response = Map.of(
                        "success", true,
                        "data", Map.of(
                                "publicId", publicId,
                                "url", imageUrl));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid public ID"));
            }
        } catch (Exception e) {
            log.error("Error generating image URL: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to generate image URL: " + e.getMessage()));
        }
    }
}
