package com.example.ecomt.dto;

import com.example.ecomt.entity.Order;
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
@Schema(description = "Order response")
public class OrderResponse {
    
    @Schema(description = "Order ID", example = "1")
    private Long id;
    
    @Schema(description = "User ID", example = "1")
    private Long userId;
    
    @Schema(description = "User name", example = "John Doe")
    private String userName;
    
    @Schema(description = "Total price", example = "299.99")
    private BigDecimal totalPrice;
    
    @Schema(description = "Order status", example = "PENDING")
    private Order.OrderStatus status;
    
    @Schema(description = "Shipping address", example = "123 Main Street")
    private String shippingAddress;
    
    @Schema(description = "Shipping city", example = "Ho Chi Minh City")
    private String shippingCity;
    
    @Schema(description = "Shipping district", example = "District 1")
    private String shippingDistrict;
    
    @Schema(description = "Shipping ward", example = "Ward 1")
    private String shippingWard;
    
    @Schema(description = "Shipping phone", example = "0123456789")
    private String shippingPhone;
    
    @Schema(description = "Shipping fee", example = "30000")
    private BigDecimal shippingFee;
    
    @Schema(description = "Payment method", example = "COD")
    private Order.PaymentMethod paymentMethod;
    
    @Schema(description = "Payment status", example = "PENDING")
    private Order.PaymentStatus paymentStatus;
    
    @Schema(description = "Transaction ID", example = "TXN123456")
    private String transactionId;
    
    @Schema(description = "Paid date", example = "2024-01-01T10:00:00")
    private LocalDateTime paidAt;
    
    @Schema(description = "Notes", example = "Please deliver in the morning")
    private String notes;
    
    @Schema(description = "Discount amount", example = "10000")
    private BigDecimal discountAmount;
    
    @Schema(description = "Final total", example = "319999")
    private BigDecimal finalTotal;
    
    @Schema(description = "Order details")
    private List<OrderDetailResponse> orderDetails;
    
    @Schema(description = "Created date", example = "2024-01-01T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Updated date", example = "2024-01-01T10:00:00")
    private LocalDateTime updatedAt;
}
