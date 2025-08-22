package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Product request")
public class ProductRequest {
    
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    @Schema(description = "Product name", example = "Nike Air Max 90")
    private String name;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer digits and 2 decimal places")
    @Schema(description = "Product price", example = "99.99")
    private BigDecimal price;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Discount price must have at most 8 integer digits and 2 decimal places")
    @Schema(description = "Product discount price", example = "79.99")
    private BigDecimal discountPrice;
    
    @Schema(description = "Product description", example = "Comfortable running shoes with excellent cushioning")
    private String description;
    
    @Schema(description = "Product image URL", example = "https://example.com/image.jpg")
    private String image;
    
    @Schema(description = "Cloudinary public ID", example = "products/nike_air_max_90")
    private String cloudinaryPublicId;
    
    @Min(value = 0, message = "Stock quantity must be non-negative")
    @Schema(description = "Stock quantity", example = "100")
    private Integer stockQuantity = 0;
    
    @Schema(description = "Product active status", example = "true")
    private Boolean isActive = true;
    
    @Schema(description = "Category ID", example = "1")
    private Long categoryId;
    
    @Schema(description = "Brand ID", example = "1")
    private Long brandId;
}
