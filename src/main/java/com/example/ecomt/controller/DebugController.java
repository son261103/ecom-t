package com.example.ecomt.controller;

import com.example.ecomt.entity.User;
import com.example.ecomt.repository.UserRepository;
import com.example.ecomt.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;
    
    @GetMapping("/check-user/{email}")
    public ResponseEntity<Map<String, Object>> checkUser(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.put("found", true);
                response.put("id", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                response.put("hasPassword", user.getPassword() != null && !user.getPassword().isEmpty());
                response.put("passwordLength", user.getPassword() != null ? user.getPassword().length() : 0);
                response.put("passwordStartsWith", user.getPassword() != null ? user.getPassword().substring(0, Math.min(10, user.getPassword().length())) : "null");
                
                // Test UserDetailsService
                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    response.put("userDetailsService", "OK");
                    response.put("authorities", userDetails.getAuthorities().toString());
                } catch (Exception e) {
                    response.put("userDetailsService", "ERROR: " + e.getMessage());
                }
                
            } else {
                response.put("found", false);
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/test-password")
    public ResponseEntity<Map<String, Object>> testPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String email = request.get("email");
        String rawPassword = request.get("password");
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                boolean matches = passwordEncoder.matches(rawPassword, user.getPassword());
                
                response.put("email", email);
                response.put("passwordMatches", matches);
                response.put("rawPasswordLength", rawPassword != null ? rawPassword.length() : 0);
                response.put("encodedPasswordLength", user.getPassword() != null ? user.getPassword().length() : 0);
                response.put("encodedPasswordPrefix", user.getPassword() != null ? user.getPassword().substring(0, Math.min(20, user.getPassword().length())) : "null");
            } else {
                response.put("error", "User not found");
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
