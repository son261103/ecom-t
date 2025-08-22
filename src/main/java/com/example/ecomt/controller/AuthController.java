package com.example.ecomt.controller;

import com.example.ecomt.dto.*;
import com.example.ecomt.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register new user with USER role and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change user password (requires authentication)")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password changed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid current password or input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<com.example.ecomt.dto.ApiResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            com.example.ecomt.dto.ApiResponse response = authService.changePassword(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Password change failed: " + e.getMessage());
        }
    }
}
