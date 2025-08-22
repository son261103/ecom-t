package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Cart item response")
public class CartItemResponse {
    
    @Schema(description = "Cart item ID", example = "1")
    private Long id;
    
    @Schema(description = "Product ID", example = "1")
    private Long productId;
    
    @Schema(description = "Product name", example = "Nike Air Max 90")
    private String productName;
    
    @Schema(description = "Product price", example = "99.99")
    private BigDecimal productPrice;
    
    @Schema(description = "Product image", example = "https://example.com/image.jpg")
    private String productImage;
    
    @Schema(description = "Quantity", example = "2")
    private Integer quantity;
    
    @Schema(description = "Subtotal", example = "199.98")
    private BigDecimal subtotal;
    
    @Schema(description = "Created date", example = "2024-01-01T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Updated date", example = "2024-01-01T10:00:00")
    private LocalDateTime updatedAt;
}
