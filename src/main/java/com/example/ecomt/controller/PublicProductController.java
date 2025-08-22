package com.example.ecomt.controller;

import com.example.ecomt.dto.ProductResponse;
import com.example.ecomt.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Public - Products", description = "Public product APIs for all users")
public class PublicProductController {
    
    private final ProductService productService;
    
    @GetMapping
    @Operation(summary = "Get all active products", description = "Get list of all active products (Public access)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    })
    public ResponseEntity<List<ProductResponse>> getAllActiveProducts() {
        List<ProductResponse> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get active product by ID", description = "Get active product details by ID (Public access)")
    public ResponseEntity<ProductResponse> getActiveProductById(@PathVariable Long id) {
        ProductResponse product = productService.getActiveProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category", description = "Get active products by category ID (Public access)")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/brand/{brandId}")
    @Operation(summary = "Get products by brand", description = "Get active products by brand ID (Public access)")
    public ResponseEntity<List<ProductResponse>> getProductsByBrand(@PathVariable Long brandId) {
        List<ProductResponse> products = productService.getProductsByBrand(brandId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search active products by name (Public access)")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @Parameter(description = "Product name to search") @RequestParam String name) {
        List<ProductResponse> products = productService.searchProducts(name);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/filter")
    @Operation(summary = "Filter products", description = "Filter active products with various criteria (Public access)")
    public ResponseEntity<List<ProductResponse>> filterProducts(
            @Parameter(description = "Category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Brand ID") @RequestParam(required = false) Long brandId,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Product name") @RequestParam(required = false) String name) {
        
        List<ProductResponse> products = productService.getProductsWithFilters(
                categoryId, brandId, minPrice, maxPrice, name);
        return ResponseEntity.ok(products);
    }
}
