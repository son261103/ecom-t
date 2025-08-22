package com.example.ecomt.dto;

import com.example.ecomt.entity.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Update order status request")
public class UpdateOrderStatusRequest {
    
    @NotNull(message = "Order status is required")
    @Schema(description = "Order status", example = "PROCESSING")
    private Order.OrderStatus status;
    
    @Schema(description = "Notes", example = "Order is being processed")
    private String notes;
}
