package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product response")
public class ProductResponse {
    
    @Schema(description = "Product ID", example = "1")
    private Long id;
    
    @Schema(description = "Product name", example = "Nike Air Max 90")
    private String name;
    
    @Schema(description = "Product price", example = "99.99")
    private BigDecimal price;
    
    @Schema(description = "Product discount price", example = "79.99")
    private BigDecimal discountPrice;
    
    @Schema(description = "Product description", example = "Comfortable running shoes")
    private String description;
    
    @Schema(description = "Product image URL", example = "https://example.com/image.jpg")
    private String image;
    
    @Schema(description = "Stock quantity", example = "100")
    private Integer stockQuantity;
    
    @Schema(description = "Product active status", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Category information")
    private CategoryInfo category;
    
    @Schema(description = "Brand information")
    private BrandInfo brand;
    
    @Schema(description = "Product variants")
    private List<ProductVariantResponse> variants;
    
    @Schema(description = "Created date", example = "2024-01-01T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Updated date", example = "2024-01-01T10:00:00")
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        private Long id;
        private String name;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandInfo {
        private Long id;
        private String name;
    }
}
