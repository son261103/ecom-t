package com.example.ecomt.converter;

import com.example.ecomt.entity.Order;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class PaymentMethodConverter implements AttributeConverter<Order.PaymentMethod, String> {

    @Override
    public String convertToDatabaseColumn(Order.PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            return null;
        }
        return paymentMethod.name();
    }

    @Override
    public Order.PaymentMethod convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return Order.PaymentMethod.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Ghi log hoặc xử lý nếu giá trị không hợp lệ
            // Ví dụ: log.error("Invalid payment method value: {}", dbData);
            throw new IllegalArgumentException("Unknown value for PaymentMethod: " + dbData);
        }
    }
}

