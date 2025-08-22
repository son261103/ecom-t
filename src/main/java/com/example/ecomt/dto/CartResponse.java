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
@Schema(description = "Cart response")
public class CartResponse {
    
    @Schema(description = "Cart ID", example = "1")
    private Long id;
    
    @Schema(description = "User ID", example = "1")
    private Long userId;
    
    @Schema(description = "Cart items")
    private List<CartItemResponse> items;
    
    @Schema(description = "Total items count", example = "5")
    private Integer totalItems;
    
    @Schema(description = "Total price", example = "299.99")
    private BigDecimal totalPrice;
    
    @Schema(description = "Created date", example = "2024-01-01T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Updated date", example = "2024-01-01T10:00:00")
    private LocalDateTime updatedAt;
}
