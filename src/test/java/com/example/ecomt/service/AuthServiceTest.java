package com.example.ecomt.service;

import com.example.ecomt.dto.AuthResponse;
import com.example.ecomt.dto.RegisterRequest;
import com.example.ecomt.entity.User;
import com.example.ecomt.repository.UserRepository;
import com.example.ecomt.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private CartService cartService;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegister_ShouldReturnRoleWithPrefix() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Test User");
        savedUser.setEmail("test@example.com");
        savedUser.setPassword("encodedPassword");
        savedUser.setRole(User.Role.USER);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateTokenWithRole(anyString(), anyString())).thenReturn("jwt-token");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertNotNull(response);
        assertEquals("ROLE_USER", response.getRole());
        assertEquals("Test User", response.getName());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("jwt-token", response.getToken());

        // Verify JWT was generated with correct role format
        verify(jwtUtil).generateTokenWithRole("test@example.com", "ROLE_USER");
    }
}
