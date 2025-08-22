package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product variant response")
public class ProductVariantResponse {
    
    @Schema(description = "Variant ID", example = "1")
    private Long id;
    
    @Schema(description = "Product ID", example = "1")
    private Long productId;
    
    @Schema(description = "Product name", example = "Nike Air Max 90")
    private String productName;
    
    @Schema(description = "Size", example = "M")
    private String size;
    
    @Schema(description = "Color", example = "Red")
    private String color;
    
    @Schema(description = "Stock quantity", example = "50")
    private Integer stockQuantity;
    
    @Schema(description = "Variant image URL", example = "https://example.com/variant-image.jpg")
    private String image;
    
    @Schema(description = "Variant active status", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Created date", example = "2024-01-01T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Updated date", example = "2024-01-01T10:00:00")
    private LocalDateTime updatedAt;
}
