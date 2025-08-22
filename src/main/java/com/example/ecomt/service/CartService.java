package com.example.ecomt.service;

import com.example.ecomt.dto.*;
import com.example.ecomt.entity.*;
import com.example.ecomt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    public CartResponse getOrCreateCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        return convertToResponse(cart);
    }
    
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        
        Product product = productRepository.findByIdAndIsActiveTrue(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found or inactive"));
        
        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }
        
        return convertToResponse(cart);
    }
    
    public CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user");
        }
        
        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
        
        return convertToResponse(cart);
    }
    
    public CartResponse removeFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user");
        }
        
        cartItemRepository.delete(cartItem);
        
        return convertToResponse(cart);
    }
    
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        cartItemRepository.deleteByCartId(cart.getId());
    }
    
    private Cart createNewCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }
    
    private CartResponse convertToResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        
        List<CartItemResponse> itemResponses = items.stream()
                .map(this::convertItemToResponse)
                .collect(Collectors.toList());
        
        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(item -> {
                    BigDecimal price = item.getProduct().getDiscountPrice() != null ? 
                            item.getProduct().getDiscountPrice() : item.getProduct().getPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser().getId());
        response.setItems(itemResponses);
        response.setTotalItems(totalItems);
        response.setTotalPrice(totalPrice);
        response.setCreatedAt(cart.getCreatedAt());
        response.setUpdatedAt(cart.getUpdatedAt());
        
        return response;
    }
    
    private CartItemResponse convertItemToResponse(CartItem item) {
        Product product = item.getProduct();
        BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
        
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setProductId(product.getId());
        response.setProductName(product.getName());
        response.setProductPrice(price);
        response.setProductImage(product.getImage());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(subtotal);
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        
        return response;
    }
}
