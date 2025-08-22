package com.example.ecomt.controller;

import com.example.ecomt.dto.ApiResponse;
import com.example.ecomt.dto.ProductRequest;
import com.example.ecomt.dto.ProductResponse;
import com.example.ecomt.service.CloudinaryService;
import com.example.ecomt.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin - Product Management", description = "Product management APIs for Admin")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class AdminProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all products", description = "Get list of all products including inactive ones (Admin only)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get product by ID", description = "Get product details by ID including inactive ones (Admin only)")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search products with filters", description = "Search products with various filters (Admin only)")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @Parameter(description = "Category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Brand ID") @RequestParam(required = false) Long brandId,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Product name") @RequestParam(required = false) String name) {

        List<ProductResponse> products = productService.getProductsWithFilters(
                categoryId, brandId, minPrice, maxPrice, name);
        return ResponseEntity.ok(products);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new product with image", description = "Create a new product with image upload (Admin only)")
    public ResponseEntity<?> createProduct(
            @RequestParam("productData") String productDataJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Parse product data from JSON string
            ProductRequest request = objectMapper.readValue(productDataJson, ProductRequest.class);

            // Upload image to Cloudinary if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                Map<String, Object> uploadResult = cloudinaryService.uploadImage(imageFile, "products");
                request.setCloudinaryPublicId((String) uploadResult.get("public_id"));
                request.setImage((String) uploadResult.get("secure_url"));
            }

            ProductResponse product = productService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (IOException e) {
            log.error("Error processing product creation: ", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to process product creation: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during product creation: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred"));
        }
    }

    @PostMapping("/json")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new product (JSON)", description = "Create a new product using JSON (Admin only)")
    public ResponseEntity<ProductResponse> createProductJson(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product with image", description = "Update product with image upload (Admin only)")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("productData") String productDataJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Parse product data from JSON string
            ProductRequest request = objectMapper.readValue(productDataJson, ProductRequest.class);

            // Get existing product to check if we need to delete old image
            ProductResponse existingProduct = productService.getProductById(id);

            // Upload new image to Cloudinary if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if exists
                if (existingProduct.getCloudinaryPublicId() != null
                        && !existingProduct.getCloudinaryPublicId().trim().isEmpty()) {
                    try {
                        cloudinaryService.deleteImage(existingProduct.getCloudinaryPublicId());
                    } catch (IOException e) {
                        log.warn("Failed to delete old image: {}", existingProduct.getCloudinaryPublicId(), e);
                    }
                }

                // Upload new image
                Map<String, Object> uploadResult = cloudinaryService.uploadImage(imageFile, "products");
                request.setCloudinaryPublicId((String) uploadResult.get("public_id"));
                request.setImage((String) uploadResult.get("secure_url"));
            }

            ProductResponse product = productService.updateProduct(id, request);
            return ResponseEntity.ok(product);
        } catch (IOException e) {
            log.error("Error processing product update: ", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to process product update: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during product update: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred"));
        }
    }

    @PutMapping("/json/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product (JSON)", description = "Update product using JSON (Admin only)")
    public ResponseEntity<ProductResponse> updateProductJson(@PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product", description = "Delete product by ID (Admin only)")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        try {
            // Get product to delete associated image
            ProductResponse product = productService.getProductById(id);

            // Delete image from Cloudinary if exists
            if (product.getCloudinaryPublicId() != null && !product.getCloudinaryPublicId().trim().isEmpty()) {
                try {
                    cloudinaryService.deleteImage(product.getCloudinaryPublicId());
                } catch (IOException e) {
                    log.warn("Failed to delete image from Cloudinary: {}", product.getCloudinaryPublicId(), e);
                }
            }

            // Delete product
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting product: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete product"));
        }
    }

    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload product image", description = "Upload image to Cloudinary and get URL")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            if (imageFile == null || imageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Image file is required"));
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(imageFile, "products");

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Image uploaded successfully",
                    "data", Map.of(
                            "publicId", uploadResult.get("public_id"),
                            "url", uploadResult.get("secure_url"),
                            "width", uploadResult.get("width"),
                            "height", uploadResult.get("height")));

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading image: ", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during image upload: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred"));
        }
    }

    @DeleteMapping("/delete-image/{publicId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete image from Cloudinary", description = "Delete image from Cloudinary by public ID")
    public ResponseEntity<?> deleteImage(@PathVariable String publicId) {
        try {
            cloudinaryService.deleteImage(publicId);
            return ResponseEntity.ok(ApiResponse.success("Image deleted successfully"));
        } catch (IOException e) {
            log.error("Error deleting image: ", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete image: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during image deletion: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred"));
        }
    }
}
