package com.example.ecomt.converter;

import com.example.ecomt.entity.Order;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<Order.OrderStatus, String> {

    @Override
    public String convertToDatabaseColumn(Order.OrderStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase();
    }

    @Override
    public Order.OrderStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return Order.OrderStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown value for OrderStatus: " + dbData);
        }
    }
}

