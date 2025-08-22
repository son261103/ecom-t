package com.example.ecomt.controller;

import com.example.ecomt.dto.ApiResponse;
import com.example.ecomt.dto.UpdateProfileRequest;
import com.example.ecomt.dto.UserProfileResponse;
import com.example.ecomt.entity.User;
import com.example.ecomt.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "User profile management APIs")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Get current user profile information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);

            UserProfileResponse response = new UserProfileResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name().toLowerCase(),
                    user.getCreatedAt(),
                    user.getUpdatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update current user profile information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ApiResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        try {
            String email = authentication.getName();
            userService.updateUserProfile(email, request.getName());
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }
}
