package com.example.ecomt.service;

import com.example.ecomt.dto.BrandRequest;
import com.example.ecomt.entity.Brand;
import com.example.ecomt.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {
    
    private final BrandRepository brandRepository;
    
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
    
    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
    }
    
    public Brand createBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new RuntimeException("Brand name already exists: " + request.getName());
        }
        
        Brand brand = new Brand();
        brand.setName(request.getName());
        return brandRepository.save(brand);
    }
    
    public Brand updateBrand(Long id, BrandRequest request) {
        Brand brand = getBrandById(id);
        
        if (!brand.getName().equals(request.getName()) && brandRepository.existsByName(request.getName())) {
            throw new RuntimeException("Brand name already exists: " + request.getName());
        }
        
        brand.setName(request.getName());
        return brandRepository.save(brand);
    }
    
    public void deleteBrand(Long id) {
        Brand brand = getBrandById(id);
        brandRepository.delete(brand);
    }
}
