package com.example.ecomt.controller;

import com.example.ecomt.dto.ProductVariantResponse;
import com.example.ecomt.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-variants")
@RequiredArgsConstructor
@Tag(name = "Public - Product Variants", description = "Public product variant APIs for all users")
public class PublicProductVariantController {
    
    private final ProductVariantService variantService;
    
    @GetMapping
    @Operation(summary = "Get all active product variants", description = "Get list of all active product variants (Public access)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product variants retrieved successfully")
    })
    public ResponseEntity<List<ProductVariantResponse>> getAllActiveVariants() {
        List<ProductVariantResponse> variants = variantService.getAllActiveVariants();
        return ResponseEntity.ok(variants);
    }
    
    @GetMapping("/product/{productId}")
    @Operation(summary = "Get active variants by product ID", description = "Get active variants for a specific product (Public access)")
    public ResponseEntity<List<ProductVariantResponse>> getActiveVariantsByProduct(@PathVariable Long productId) {
        List<ProductVariantResponse> variants = variantService.getActiveVariantsByProduct(productId);
        return ResponseEntity.ok(variants);
    }
}
