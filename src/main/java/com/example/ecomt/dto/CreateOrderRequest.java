package com.example.ecomt.dto;

import com.example.ecomt.entity.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Create order request")
public class CreateOrderRequest {
    
    @NotBlank(message = "Shipping address is required")
    @Schema(description = "Shipping address", example = "123 Main Street")
    private String shippingAddress;
    
    @NotBlank(message = "Shipping city is required")
    @Schema(description = "Shipping city", example = "Ho Chi Minh City")
    private String shippingCity;
    
    @NotBlank(message = "Shipping district is required")
    @Schema(description = "Shipping district", example = "District 1")
    private String shippingDistrict;
    
    @NotBlank(message = "Shipping ward is required")
    @Schema(description = "Shipping ward", example = "Ward 1")
    private String shippingWard;
    
    @NotBlank(message = "Shipping phone is required")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    @Schema(description = "Shipping phone", example = "0123456789")
    private String shippingPhone;
    
    @Schema(description = "Shipping fee", example = "30000")
    private BigDecimal shippingFee = BigDecimal.ZERO;
    
    @NotNull(message = "Payment method is required")
    @Schema(description = "Payment method", example = "COD")
    private Order.PaymentMethod paymentMethod;
    
    @Schema(description = "Order notes", example = "Please deliver in the morning")
    private String notes;
    
    @Schema(description = "Discount amount", example = "10000")
    private BigDecimal discountAmount = BigDecimal.ZERO;
}
