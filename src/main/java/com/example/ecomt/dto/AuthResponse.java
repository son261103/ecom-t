package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response")
public class AuthResponse {
    
    @Schema(description = "JWT token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;
    
    @Schema(description = "Token type", example = "Bearer")
    private String type = "Bearer";
    
    @Schema(description = "User ID", example = "1")
    private Long id;
    
    @Schema(description = "User name", example = "John Doe")
    private String name;
    
    @Schema(description = "User email", example = "user@example.com")
    private String email;
    
    @Schema(description = "User role", example = "USER")
    private String role;
    
    public AuthResponse(String token, Long id, String name, String email, String role) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
