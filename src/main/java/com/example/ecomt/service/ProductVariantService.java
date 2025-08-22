package com.example.ecomt.service;

import com.example.ecomt.dto.ProductVariantRequest;
import com.example.ecomt.dto.ProductVariantResponse;
import com.example.ecomt.entity.Product;
import com.example.ecomt.entity.ProductVariant;
import com.example.ecomt.repository.ProductRepository;
import com.example.ecomt.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductVariantService {
    
    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    
    public List<ProductVariantResponse> getAllVariants() {
        return variantRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProductVariantResponse> getAllActiveVariants() {
        return variantRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
        return convertToResponse(variant);
    }
    
    public List<ProductVariantResponse> getVariantsByProduct(Long productId) {
        return variantRepository.findByProductId(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProductVariantResponse> getActiveVariantsByProduct(Long productId) {
        return variantRepository.findByProductIdAndIsActiveTrue(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProductVariantResponse createVariant(ProductVariantRequest request) {
        if (variantRepository.existsByProductIdAndSizeAndColor(
                request.getProductId(), request.getSize(), request.getColor())) {
            throw new RuntimeException("Product variant already exists with size: " + 
                    request.getSize() + " and color: " + request.getColor());
        }
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));
        
        ProductVariant variant = new ProductVariant();
        mapRequestToEntity(request, variant, product);
        
        ProductVariant savedVariant = variantRepository.save(variant);
        return convertToResponse(savedVariant);
    }
    
    public ProductVariantResponse updateVariant(Long id, ProductVariantRequest request) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
        
        // Check if size/color combination already exists for another variant
        if (!variant.getSize().equals(request.getSize()) || !variant.getColor().equals(request.getColor())) {
            if (variantRepository.existsByProductIdAndSizeAndColor(
                    request.getProductId(), request.getSize(), request.getColor())) {
                throw new RuntimeException("Product variant already exists with size: " + 
                        request.getSize() + " and color: " + request.getColor());
            }
        }
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));
        
        mapRequestToEntity(request, variant, product);
        ProductVariant savedVariant = variantRepository.save(variant);
        return convertToResponse(savedVariant);
    }
    
    public void deleteVariant(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
        variantRepository.delete(variant);
    }
    
    private void mapRequestToEntity(ProductVariantRequest request, ProductVariant variant, Product product) {
        variant.setProduct(product);
        variant.setSize(request.getSize());
        variant.setColor(request.getColor());
        variant.setStockQuantity(request.getStockQuantity());
        variant.setImage(request.getImage());
        variant.setCloudinaryPublicId(request.getCloudinaryPublicId());
        variant.setIsActive(request.getIsActive());
    }
    
    private ProductVariantResponse convertToResponse(ProductVariant variant) {
        ProductVariantResponse response = new ProductVariantResponse();
        response.setId(variant.getId());
        response.setProductId(variant.getProduct().getId());
        response.setProductName(variant.getProduct().getName());
        response.setSize(variant.getSize());
        response.setColor(variant.getColor());
        response.setStockQuantity(variant.getStockQuantity());
        response.setImage(variant.getImage());
        response.setIsActive(variant.getIsActive());
        response.setCreatedAt(variant.getCreatedAt());
        response.setUpdatedAt(variant.getUpdatedAt());
        return response;
    }
}
