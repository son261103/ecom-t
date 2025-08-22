package com.example.ecomt.repository;

import com.example.ecomt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByIsActiveTrue();
    
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    List<Product> findByBrandIdAndIsActiveTrue(Long brandId);
    
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    List<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<Product> findProductsWithFilters(@Param("categoryId") Long categoryId,
                                        @Param("brandId") Long brandId,
                                        @Param("minPrice") BigDecimal minPrice,
                                        @Param("maxPrice") BigDecimal maxPrice,
                                        @Param("name") String name);
    
    boolean existsByName(String name);
    
    Optional<Product> findByIdAndIsActiveTrue(Long id);
}
