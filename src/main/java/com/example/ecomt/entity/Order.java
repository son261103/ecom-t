package com.example.ecomt.entity;

import com.example.ecomt.converter.OrderStatusConverter;
import com.example.ecomt.converter.PaymentMethodConverter;
import com.example.ecomt.converter.PaymentStatusConverter;
import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.Convert;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "orders_user_id_foreign"))
    private User user;
    
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(nullable = false)
    @Convert(converter = OrderStatusConverter.class)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;
    
    @Column(name = "shipping_city", length = 100)
    private String shippingCity;
    
    @Column(name = "shipping_district", length = 100)
    private String shippingDistrict;
    
    @Column(name = "shipping_ward", length = 100)
    private String shippingWard;
    
    @Column(name = "shipping_phone", length = 20)
    private String shippingPhone;
    
    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;
    
    @Column(name = "payment_method")
    @Convert(converter = PaymentMethodConverter.class)
    private PaymentMethod paymentMethod = PaymentMethod.COD;
    
    @Column(name = "payment_status")
    @Convert(converter = PaymentStatusConverter.class)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "transaction_id", length = 255)
    private String transactionId;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "final_total", precision = 10, scale = 2)
    private BigDecimal finalTotal;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PENDING, PROCESSING, COMPLETED
    }
    
    public enum PaymentMethod {
        COD
    }
    
        public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED
    }
}
