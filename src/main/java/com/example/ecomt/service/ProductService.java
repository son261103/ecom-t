package com.example.ecomt.service;

import com.example.ecomt.dto.ProductRequest;
import com.example.ecomt.dto.ProductResponse;
import com.example.ecomt.dto.ProductVariantResponse;
import com.example.ecomt.entity.Brand;
import com.example.ecomt.entity.Category;
import com.example.ecomt.entity.Product;
import com.example.ecomt.entity.ProductVariant;
import com.example.ecomt.repository.BrandRepository;
import com.example.ecomt.repository.CategoryRepository;
import com.example.ecomt.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToResponse(product);
    }

    public ProductResponse getActiveProductById(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Active product not found with id: " + id));
        return convertToResponse(product);
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByBrand(Long brandId) {
        return productRepository.findByBrandIdAndIsActiveTrue(brandId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsWithFilters(Long categoryId, Long brandId,
            BigDecimal minPrice, BigDecimal maxPrice, String name) {
        return productRepository.findProductsWithFilters(categoryId, brandId, minPrice, maxPrice, name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product name already exists: " + request.getName());
        }

        Product product = new Product();
        mapRequestToEntity(request, product);

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product name already exists: " + request.getName());
        }

        mapRequestToEntity(request, product);
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private void mapRequestToEntity(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());
        product.setCloudinaryPublicId(request.getCloudinaryPublicId());
        product.setStockQuantity(request.getStockQuantity());
        product.setIsActive(request.getIsActive());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found with id: " + request.getBrandId()));
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setDiscountPrice(product.getDiscountPrice());
        response.setDescription(product.getDescription());
        response.setImage(product.getImage());
        response.setCloudinaryPublicId(product.getCloudinaryPublicId());
        response.setStockQuantity(product.getStockQuantity());
        response.setIsActive(product.getIsActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        if (product.getCategory() != null) {
            response.setCategory(new ProductResponse.CategoryInfo(
                    product.getCategory().getId(),
                    product.getCategory().getName()));
        }

        if (product.getBrand() != null) {
            response.setBrand(new ProductResponse.BrandInfo(
                    product.getBrand().getId(),
                    product.getBrand().getName()));
        }

        if (product.getVariants() != null) {
            List<ProductVariantResponse> variantResponses = product.getVariants().stream()
                    .map(this::convertVariantToResponse)
                    .collect(Collectors.toList());
            response.setVariants(variantResponses);
        }

        return response;
    }

    private ProductVariantResponse convertVariantToResponse(ProductVariant variant) {
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
