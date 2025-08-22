package com.example.ecomt.controller;

import com.example.ecomt.entity.Brand;
import com.example.ecomt.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@Tag(name = "Public - Brands", description = "Public brand APIs for all users")
public class PublicBrandController {
    
    private final BrandService brandService;
    
    @GetMapping
    @Operation(summary = "Get all brands", description = "Get list of all brands (Public access)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Brands retrieved successfully")
    })
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get brand by ID", description = "Get brand details by ID (Public access)")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        Brand brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }
}
