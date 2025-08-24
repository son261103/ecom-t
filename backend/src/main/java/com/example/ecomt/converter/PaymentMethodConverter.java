package com.example.ecomt.converter;

import com.example.ecomt.entity.Order;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PaymentMethodConverter implements AttributeConverter<Order.PaymentMethod, String> {

    @Override
    public String convertToDatabaseColumn(Order.PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            return null;
        }
        // Luôn lưu trữ dưới dạng chữ hoa trong CSDL
        return paymentMethod.name().toUpperCase();
    }

    @Override
    public Order.PaymentMethod convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            // Chuyển đổi từ CSDL sang enum, không phân biệt chữ hoa chữ thường
            return Order.PaymentMethod.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Ghi log hoặc xử lý nếu giá trị không hợp lệ
            throw new IllegalArgumentException("Unknown value for PaymentMethod: " + dbData);
        }
    }
}

