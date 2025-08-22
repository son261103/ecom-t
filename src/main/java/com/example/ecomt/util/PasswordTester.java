package com.example.ecomt.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTester {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Test password từ database
        String encodedFromDB = "$2a$10$Hn7HhfzwVhCVfdGh/ZUY..BJzGRsz906jF79MeTRNFydb8DQ5IGJm";
        
        // Test với các mật khẩu có thể
        String[] testPasswords = {
            "password",
            "admin",
            "123456", 
            "admin123",
            "password123",
            "admin@yahoo.com",
            "Phạm Sơn",
            ""
        };
        
        System.out.println("Testing passwords against: " + encodedFromDB);
        System.out.println("========================================");
        
        for (String testPassword : testPasswords) {
            boolean matches = encoder.matches(testPassword, encodedFromDB);
            System.out.println("Password: '" + testPassword + "' -> " + (matches ? "MATCH!" : "no match"));
        }
        
        // Tạo mật khẩu mới để test
        System.out.println("\n========================================");
        System.out.println("Creating new encoded passwords:");
        for (String testPassword : new String[]{"password", "admin", "123456"}) {
            String encoded = encoder.encode(testPassword);
            System.out.println("'" + testPassword + "' -> " + encoded);
        }
    }
}
