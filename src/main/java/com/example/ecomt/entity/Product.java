package com.example.ecomt.entity;

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
@Table(name = "products", indexes = {
    @Index(name = "products_category_id_brand_id_index", columnList = "category_id, brand_id"),
    @Index(name = "products_created_at_index", columnList = "created_at"),
    @Index(name = "products_is_active_index", columnList = "is_active"),
    @Index(name = "products_name_index", columnList = "name"),
    @Index(name = "products_price_index", columnList = "price")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 255)
    private String image;
    
    @Column(name = "cloudinary_public_id", length = 255)
    private String cloudinaryPublicId;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "products_category_id_foreign"))
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", foreignKey = @ForeignKey(name = "products_brand_id_foreign"))
    private Brand brand;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
