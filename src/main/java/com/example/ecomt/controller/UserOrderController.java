package com.example.ecomt.controller;

import com.example.ecomt.dto.CreateOrderRequest;
import com.example.ecomt.dto.OrderResponse;
import com.example.ecomt.service.OrderService;
import com.example.ecomt.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
@Tag(name = "User - Order Management", description = "Order management APIs for authenticated users")
@SecurityRequirement(name = "bearerAuth")
public class UserOrderController {
    
    private final OrderService orderService;
    private final UserService userService;
    
    @GetMapping
    @Operation(summary = "Get user orders", description = "Get all orders for the current user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Orders retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        List<OrderResponse> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID", description = "Get specific order details for the current user")
    public ResponseEntity<OrderResponse> getUserOrderById(
            Authentication authentication,
            @PathVariable Long orderId) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        OrderResponse order = orderService.getUserOrderById(userId, orderId);
        return ResponseEntity.ok(order);
    }
    
    @PostMapping
    @Operation(summary = "Create order from cart", description = "Create a new order from the user's cart")
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();
        OrderResponse order = orderService.createOrderFromCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }
}
