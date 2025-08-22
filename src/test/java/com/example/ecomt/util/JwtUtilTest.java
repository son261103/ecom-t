package com.example.ecomt.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Set test values for private fields
        ReflectionTestUtils.setField(jwtUtil, "secret", "testSecretKeyThatIsLongEnoughForHS256AlgorithmToWorkProperly");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L); // 1 day
    }

    @Test
    void testGenerateTokenWithRole_ShouldFormatRoleCorrectly() {
        // Test with role without prefix
        String token1 = jwtUtil.generateTokenWithRole("user@example.com", "USER");
        String extractedRole1 = jwtUtil.extractRole(token1);
        assertEquals("ROLE_USER", extractedRole1);

        // Test with role already having prefix
        String token2 = jwtUtil.generateTokenWithRole("admin@example.com", "ROLE_ADMIN");
        String extractedRole2 = jwtUtil.extractRole(token2);
        assertEquals("ROLE_ADMIN", extractedRole2);

        // Test with null role (should default to ROLE_USER)
        String token3 = jwtUtil.generateTokenWithRole("user@example.com", null);
        String extractedRole3 = jwtUtil.extractRole(token3);
        assertEquals("ROLE_USER", extractedRole3);
    }

    @Test
    void testExtractRole_ShouldHandleDifferentFormats() {
        // Test extracting role that already has prefix
        String token1 = jwtUtil.generateTokenWithRole("user@example.com", "ROLE_ADMIN");
        String extractedRole1 = jwtUtil.extractRole(token1);
        assertEquals("ROLE_ADMIN", extractedRole1);

        // Test extracting username
        String extractedUsername = jwtUtil.extractUsername(token1);
        assertEquals("user@example.com", extractedUsername);
    }

    @Test
    void testTokenValidation() {
        String token = jwtUtil.generateTokenWithRole("test@example.com", "ROLE_USER");

        // Token should not be expired immediately
        assertFalse(jwtUtil.extractExpiration(token).before(new java.util.Date()));

        // Should extract correct username
        assertEquals("test@example.com", jwtUtil.extractUsername(token));

        // Should extract correct role
        assertEquals("ROLE_USER", jwtUtil.extractRole(token));
    }
}
