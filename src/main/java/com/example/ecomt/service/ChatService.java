package com.example.ecomt.service;

import com.example.ecomt.dto.ChatRequest;
import com.example.ecomt.dto.ChatResponse;
import com.example.ecomt.dto.ProductResponse;
import com.example.ecomt.entity.Brand;
import com.example.ecomt.entity.Category;
import com.example.ecomt.repository.BrandRepository;
import com.example.ecomt.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final GeminiService geminiService;
    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ChatResponse processChat(ChatRequest request) {
        try {
            // Get all available data
            List<ProductResponse> allProducts = productService.getAllActiveProducts();
            List<Category> allCategories = categoryRepository.findAll();
            List<Brand> allBrands = brandRepository.findAll();

            // Build context for Gemini
            String context = buildProductContext(allProducts, allCategories, allBrands);
            
            // Create enhanced prompt
            String enhancedPrompt = createEnhancedPrompt(request.getMessage(), context);
            
            // Get response from Gemini
            String geminiResponse = geminiService.generateResponse(enhancedPrompt);
            
            // Analyze the user message to suggest relevant products
            List<ChatResponse.ProductInfo> suggestedProducts = findRelevantProducts(request.getMessage(), allProducts);
            List<ChatResponse.CategoryInfo> suggestedCategories = findRelevantCategories(request.getMessage(), allCategories);
            List<ChatResponse.BrandInfo> suggestedBrands = findRelevantBrands(request.getMessage(), allBrands);

            // Create response
            ChatResponse response = new ChatResponse();
            response.setMessage(geminiResponse);
            response.setConversationId(request.getConversationId() != null ? 
                request.getConversationId() : UUID.randomUUID().toString());
            response.setTimestamp(LocalDateTime.now());
            response.setSuggestedProducts(suggestedProducts);
            response.setSuggestedCategories(suggestedCategories);
            response.setSuggestedBrands(suggestedBrands);

            return response;

        } catch (Exception e) {
            log.error("Error processing chat request: ", e);
            
            ChatResponse errorResponse = new ChatResponse();
            errorResponse.setMessage("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.");
            errorResponse.setConversationId(request.getConversationId() != null ? 
                request.getConversationId() : UUID.randomUUID().toString());
            errorResponse.setTimestamp(LocalDateTime.now());
            errorResponse.setSuggestedProducts(new ArrayList<>());
            errorResponse.setSuggestedCategories(new ArrayList<>());
            errorResponse.setSuggestedBrands(new ArrayList<>());
            
            return errorResponse;
        }
    }

    private String buildProductContext(List<ProductResponse> products, List<Category> categories, List<Brand> brands) {
        StringBuilder context = new StringBuilder();
        
        context.append("Bạn là trợ lý AI của một cửa hàng thương mại điện tử. ");
        context.append("Dưới đây là thông tin về sản phẩm, danh mục và thương hiệu của cửa hàng:\n\n");
        
        // Add categories info
        context.append("DANH MỤC SẢN PHẨM:\n");
        for (Category category : categories) {
            context.append("- ").append(category.getName()).append("\n");
        }
        context.append("\n");
        
        // Add brands info
        context.append("THƯƠNG HIỆU:\n");
        for (Brand brand : brands) {
            context.append("- ").append(brand.getName()).append("\n");
        }
        context.append("\n");
        
        // Add products info (limit to first 20 to avoid token limits)
        context.append("SẢN PHẨM HIỆN CÓ:\n");
        int count = 0;
        for (ProductResponse product : products) {
            if (count >= 20) break;
            context.append("- ").append(product.getName())
                   .append(" (").append(product.getPrice()).append(" VND)");
            if (product.getCategory() != null) {
                context.append(" - Danh mục: ").append(product.getCategory().getName());
            }
            if (product.getBrand() != null) {
                context.append(" - Thương hiệu: ").append(product.getBrand().getName());
            }
            context.append("\n");
            count++;
        }
        
        context.append("\nHãy trả lời câu hỏi của khách hàng một cách thân thiện và hữu ích. ");
        context.append("Nếu khách hàng hỏi về sản phẩm, hãy đề xuất những sản phẩm phù hợp từ danh sách trên. ");
        context.append("Trả lời bằng tiếng Việt.\n\n");
        
        return context.toString();
    }

    private String createEnhancedPrompt(String userMessage, String context) {
        return context + "KHÁCH HÀNG HỎI: " + userMessage + "\n\nTRẢ LỜI:";
    }

    private List<ChatResponse.ProductInfo> findRelevantProducts(String message, List<ProductResponse> products) {
        String lowerMessage = message.toLowerCase();
        
        return products.stream()
                .filter(product -> 
                    product.getName().toLowerCase().contains(lowerMessage) ||
                    lowerMessage.contains(product.getName().toLowerCase()) ||
                    (product.getDescription() != null && 
                     product.getDescription().toLowerCase().contains(lowerMessage)) ||
                    (product.getCategory() != null && 
                     lowerMessage.contains(product.getCategory().getName().toLowerCase())) ||
                    (product.getBrand() != null && 
                     lowerMessage.contains(product.getBrand().getName().toLowerCase()))
                )
                .limit(5)
                .map(this::convertToProductInfo)
                .collect(Collectors.toList());
    }

    private List<ChatResponse.CategoryInfo> findRelevantCategories(String message, List<Category> categories) {
        String lowerMessage = message.toLowerCase();
        
        return categories.stream()
                .filter(category -> 
                    category.getName().toLowerCase().contains(lowerMessage) ||
                    lowerMessage.contains(category.getName().toLowerCase())
                )
                .limit(3)
                .map(category -> new ChatResponse.CategoryInfo(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }

    private List<ChatResponse.BrandInfo> findRelevantBrands(String message, List<Brand> brands) {
        String lowerMessage = message.toLowerCase();
        
        return brands.stream()
                .filter(brand -> 
                    brand.getName().toLowerCase().contains(lowerMessage) ||
                    lowerMessage.contains(brand.getName().toLowerCase())
                )
                .limit(3)
                .map(brand -> new ChatResponse.BrandInfo(brand.getId(), brand.getName()))
                .collect(Collectors.toList());
    }

    private ChatResponse.ProductInfo convertToProductInfo(ProductResponse product) {
        return new ChatResponse.ProductInfo(
            product.getId(),
            product.getName(),
            product.getPrice().toString() + " VND",
            product.getImage(),
            product.getDescription(),
            product.getCategory() != null ? product.getCategory().getName() : null,
            product.getBrand() != null ? product.getBrand().getName() : null
        );
    }
}
