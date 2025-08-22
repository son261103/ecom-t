package com.example.ecomt.repository;

import com.example.ecomt.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    
    List<ProductVariant> findByProductIdAndIsActiveTrue(Long productId);
    
    List<ProductVariant> findByProductId(Long productId);
    
    Optional<ProductVariant> findByProductIdAndSizeAndColorAndIsActiveTrue(Long productId, String size, String color);
    
    boolean existsByProductIdAndSizeAndColor(Long productId, String size, String color);
    
    List<ProductVariant> findByIsActiveTrue();
}
