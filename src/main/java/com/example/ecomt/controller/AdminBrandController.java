package com.example.ecomt.controller;

import com.example.ecomt.dto.ApiResponse;
import com.example.ecomt.dto.BrandRequest;
import com.example.ecomt.entity.Brand;
import com.example.ecomt.service.BrandService;
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
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
@Tag(name = "Admin - Brand Management", description = "Brand management APIs for Admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminBrandController {
    
    private final BrandService brandService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all brands", description = "Get list of all brands (Admin only)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Brands retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get brand by ID", description = "Get brand details by ID (Admin only)")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        Brand brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new brand", description = "Create a new brand (Admin only)")
    public ResponseEntity<Brand> createBrand(@Valid @RequestBody BrandRequest request) {
        Brand brand = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(brand);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update brand", description = "Update brand by ID (Admin only)")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        Brand brand = brandService.updateBrand(id, request);
        return ResponseEntity.ok(brand);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete brand", description = "Delete brand by ID (Admin only)")
    public ResponseEntity<ApiResponse> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success("Brand deleted successfully"));
    }
}
