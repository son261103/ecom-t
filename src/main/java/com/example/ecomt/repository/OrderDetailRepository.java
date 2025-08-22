package com.example.ecomt.repository;

import com.example.ecomt.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    
    List<OrderDetail> findByOrderId(Long orderId);
    
    List<OrderDetail> findByProductId(Long productId);
}
