package com.example.ecomt.controller;

import com.example.ecomt.dto.ApiResponse;
import com.example.ecomt.dto.ProductVariantRequest;
import com.example.ecomt.dto.ProductVariantResponse;
import com.example.ecomt.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/product-variants")
@RequiredArgsConstructor
@Tag(name = "Admin - Product Variant Management", description = "Product variant management APIs for Admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminProductVariantController {
    
    private final ProductVariantService variantService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all product variants", description = "Get list of all product variants including inactive ones (Admin only)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product variants retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    public ResponseEntity<List<ProductVariantResponse>> getAllVariants() {
        List<ProductVariantResponse> variants = variantService.getAllVariants();
        return ResponseEntity.ok(variants);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get product variant by ID", description = "Get product variant details by ID (Admin only)")
    public ResponseEntity<ProductVariantResponse> getVariantById(@PathVariable Long id) {
        ProductVariantResponse variant = variantService.getVariantById(id);
        return ResponseEntity.ok(variant);
    }
    
    @GetMapping("/product/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get variants by product ID", description = "Get all variants for a specific product (Admin only)")
    public ResponseEntity<List<ProductVariantResponse>> getVariantsByProduct(@PathVariable Long productId) {
        List<ProductVariantResponse> variants = variantService.getVariantsByProduct(productId);
        return ResponseEntity.ok(variants);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new product variant", description = "Create a new product variant (Admin only)")
    public ResponseEntity<ProductVariantResponse> createVariant(@Valid @RequestBody ProductVariantRequest request) {
        ProductVariantResponse variant = variantService.createVariant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(variant);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product variant", description = "Update product variant by ID (Admin only)")
    public ResponseEntity<ProductVariantResponse> updateVariant(@PathVariable Long id, @Valid @RequestBody ProductVariantRequest request) {
        ProductVariantResponse variant = variantService.updateVariant(id, request);
        return ResponseEntity.ok(variant);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product variant", description = "Delete product variant by ID (Admin only)")
    public ResponseEntity<ApiResponse> deleteVariant(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ResponseEntity.ok(ApiResponse.success("Product variant deleted successfully"));
    }
}
