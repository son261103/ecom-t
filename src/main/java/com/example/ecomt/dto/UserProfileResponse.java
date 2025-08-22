package com.example.ecomt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile response")
public class UserProfileResponse {
    
    @Schema(description = "User ID", example = "1")
    private Long id;
    
    @Schema(description = "User name", example = "John Doe")
    private String name;
    
    @Schema(description = "User email", example = "user@example.com")
    private String email;
    
    @Schema(description = "User role", example = "USER")
    private String role;
    
    @Schema(description = "Account created date", example = "2024-01-01T10:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Account updated date", example = "2024-01-01T10:00:00")
    private LocalDateTime updatedAt;
}
