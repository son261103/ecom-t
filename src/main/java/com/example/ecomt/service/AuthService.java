package com.example.ecomt.service;

import com.example.ecomt.dto.*;
import com.example.ecomt.entity.User;
import com.example.ecomt.repository.UserRepository;
import com.example.ecomt.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CartService cartService;

    public AuthResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            if (!passwordMatches) {
                throw new RuntimeException("Bad credentials");
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            String roleName = user.getRole().name().toLowerCase();
            String roleWithPrefix = "ROLE_" + user.getRole().name().toUpperCase();
            String token = jwtUtil.generateTokenWithRole(user.getEmail(), roleWithPrefix);

            return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), roleName);
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.USER); // Luôn tạo với role USER

            user = userRepository.save(user);

            // Tự động tạo cart cho user mới
            try {
                cartService.getOrCreateCart(user.getId());
            } catch (Exception e) {
                // Log error but don't fail registration
                System.err.println("Failed to create cart for new user: " + e.getMessage());
            }

            // Tạo JWT token với role định dạng ROLE_xxx
            String roleName = user.getRole().name().toLowerCase();
            String roleWithPrefix = "ROLE_" + user.getRole().name().toUpperCase();
            String token = jwtUtil.generateTokenWithRole(user.getEmail(), roleWithPrefix);

            return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), roleName);
        } catch (RuntimeException e) {
            System.err.println("Registration error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected registration error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public ApiResponse changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.success("Password changed successfully");
    }
}
