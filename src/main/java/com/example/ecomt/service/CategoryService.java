package com.example.ecomt.service;

import com.example.ecomt.dto.CategoryRequest;
import com.example.ecomt.entity.Category;
import com.example.ecomt.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
    
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists: " + request.getName());
        }
        
        Category category = new Category();
        category.setName(request.getName());
        return categoryRepository.save(category);
    }
    
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);
        
        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists: " + request.getName());
        }
        
        category.setName(request.getName());
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
