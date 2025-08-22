package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Product variant request")
public class ProductVariantRequest {
    
    @NotNull(message = "Product ID is required")
    @Schema(description = "Product ID", example = "1")
    private Long productId;
    
    @NotBlank(message = "Size is required")
    @Size(max = 50, message = "Size must not exceed 50 characters")
    @Schema(description = "Product size", example = "M")
    private String size;
    
    @NotBlank(message = "Color is required")
    @Size(max = 50, message = "Color must not exceed 50 characters")
    @Schema(description = "Product color", example = "Red")
    private String color;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    @Schema(description = "Stock quantity", example = "50")
    private Integer stockQuantity = 0;
    
    @Schema(description = "Variant image URL", example = "https://example.com/variant-image.jpg")
    private String image;
    
    @Schema(description = "Cloudinary public ID", example = "variants/nike_air_max_90_red_m")
    private String cloudinaryPublicId;
    
    @Schema(description = "Variant active status", example = "true")
    private Boolean isActive = true;
}
