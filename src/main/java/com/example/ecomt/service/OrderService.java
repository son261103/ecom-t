package com.example.ecomt.service;

import com.example.ecomt.dto.*;
import com.example.ecomt.entity.*;
import com.example.ecomt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToResponse(order);
    }
    
    public OrderResponse getUserOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order does not belong to user");
        }
        
        return convertToResponse(order);
    }
    
    public OrderResponse createOrderFromCart(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total price
        BigDecimal totalPrice = cartItems.stream()
                .map(item -> {
                    BigDecimal price = item.getProduct().getDiscountPrice() != null ? 
                            item.getProduct().getDiscountPrice() : item.getProduct().getPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal finalTotal = totalPrice.add(request.getShippingFee()).subtract(request.getDiscountAmount());
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(totalPrice);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingDistrict(request.getShippingDistrict());
        order.setShippingWard(request.getShippingWard());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingFee(request.getShippingFee());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setNotes(request.getNotes());
        order.setDiscountAmount(request.getDiscountAmount());
        order.setFinalTotal(finalTotal);
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order details
        for (CartItem cartItem : cartItems) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(savedOrder);
            orderDetail.setProduct(cartItem.getProduct());
            orderDetail.setQuantity(cartItem.getQuantity());
            
            BigDecimal price = cartItem.getProduct().getDiscountPrice() != null ? 
                    cartItem.getProduct().getDiscountPrice() : cartItem.getProduct().getPrice();
            orderDetail.setPrice(price);
            
            orderDetailRepository.save(orderDetail);
        }
        
        // Clear cart
        cartItemRepository.deleteByCartId(cart.getId());
        
        return convertToResponse(savedOrder);
    }
    
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            order.setNotes(request.getNotes());
        }
        
        // If order is completed and payment method is COD, mark as paid
        if (request.getStatus() == Order.OrderStatus.COMPLETED && 
            order.getPaymentMethod() == Order.PaymentMethod.COD &&
            order.getPaymentStatus() == Order.PaymentStatus.PENDING) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
        }
        
        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
    }
    
    public List<OrderResponse> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private OrderResponse convertToResponse(Order order) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());
        
        List<OrderDetailResponse> detailResponses = orderDetails.stream()
                .map(this::convertDetailToResponse)
                .collect(Collectors.toList());
        
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser().getId());
        response.setUserName(order.getUser().getName());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setShippingAddress(order.getShippingAddress());
        response.setShippingCity(order.getShippingCity());
        response.setShippingDistrict(order.getShippingDistrict());
        response.setShippingWard(order.getShippingWard());
        response.setShippingPhone(order.getShippingPhone());
        response.setShippingFee(order.getShippingFee());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setTransactionId(order.getTransactionId());
        response.setPaidAt(order.getPaidAt());
        response.setNotes(order.getNotes());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setFinalTotal(order.getFinalTotal());
        response.setOrderDetails(detailResponses);
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        return response;
    }
    
    private OrderDetailResponse convertDetailToResponse(OrderDetail detail) {
        Product product = detail.getProduct();
        BigDecimal subtotal = detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
        
        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(detail.getId());
        response.setProductId(product.getId());
        response.setProductName(product.getName());
        response.setProductImage(product.getImage());
        response.setQuantity(detail.getQuantity());
        response.setPrice(detail.getPrice());
        response.setSubtotal(subtotal);
        response.setCreatedAt(detail.getCreatedAt());
        response.setUpdatedAt(detail.getUpdatedAt());
        
        return response;
    }
}
