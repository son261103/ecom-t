package com.example.ecomt.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String message;
    private String conversationId;
    private LocalDateTime timestamp;
    private List<ProductInfo> suggestedProducts;
    private List<CategoryInfo> suggestedCategories;
    private List<BrandInfo> suggestedBrands;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfo {
        private Long id;
        private String name;
        private String price;
        private String image;
        private String description;
        private String categoryName;
        private String brandName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandInfo {
        private Long id;
        private String name;
    }
}
