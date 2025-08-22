package com.example.ecomt.controller;

import com.example.ecomt.dto.*;
import com.example.ecomt.service.CartService;
import com.example.ecomt.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
@Tag(name = "User - Cart Management", description = "Cart management APIs for authenticated users")
@SecurityRequirement(name = "bearerAuth")
public class UserCartController {
    
    private final CartService cartService;
    private final UserService userService;
    
    @GetMapping
    @Operation(summary = "Get user cart", description = "Get current user's cart with all items")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cart retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        CartResponse cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/add")
    @Operation(summary = "Add item to cart", description = "Add a product to the user's cart")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "Update cart item", description = "Update quantity of a cart item")
    public ResponseEntity<CartResponse> updateCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        CartResponse cart = cartService.updateCartItem(userId, cartItemId, request);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "Remove item from cart", description = "Remove a specific item from the cart")
    public ResponseEntity<CartResponse> removeFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        CartResponse cart = cartService.removeFromCart(userId, cartItemId);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/clear")
    @Operation(summary = "Clear cart", description = "Remove all items from the cart")
    public ResponseEntity<ApiResponse> clearCart(Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully"));
    }
}
