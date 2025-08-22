package com.example.ecomt.converter;

import com.example.ecomt.entity.User;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<User.Role, String> {

    @Override
    public String convertToDatabaseColumn(User.Role role) {
        if (role == null) {
            return null;
        }
        // Lưu vào database dưới dạng lowercase để đồng bộ với dữ liệu hiện tại
        return role.name().toLowerCase();
    }

    @Override
    public User.Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return User.Role.USER; // Default role
        }

        try {
            // Xử lý cả uppercase và lowercase từ database
            String roleValue = dbData.trim();

            // Chuyển về uppercase để match với enum
            if ("user".equalsIgnoreCase(roleValue)) {
                return User.Role.USER;
            } else if ("admin".equalsIgnoreCase(roleValue)) {
                return User.Role.ADMIN;
            } else {
                // Thử convert trực tiếp cho trường hợp uppercase
                return User.Role.valueOf(roleValue.toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            // Return default role cho các giá trị không hợp lệ
            System.err.println("Invalid role value in database: '" + dbData + "', defaulting to USER");
            return User.Role.USER;
        }
    }
}
