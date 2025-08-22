package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Add to cart request")
public class AddToCartRequest {
    
    @NotNull(message = "Product ID is required")
    @Schema(description = "Product ID", example = "1")
    private Long productId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Schema(description = "Quantity", example = "2")
    private Integer quantity;
}
