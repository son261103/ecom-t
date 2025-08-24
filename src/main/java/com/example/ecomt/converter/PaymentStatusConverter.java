package com.example.ecomt.converter;

import com.example.ecomt.entity.Order;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PaymentStatusConverter implements AttributeConverter<Order.PaymentStatus, String> {

    @Override
    public String convertToDatabaseColumn(Order.PaymentStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase();
    }

    @Override
    public Order.PaymentStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return Order.PaymentStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle unknown values, maybe return a default or throw an exception
            throw new IllegalArgumentException("Unknown value for PaymentStatus: " + dbData);
        }
    }
}

