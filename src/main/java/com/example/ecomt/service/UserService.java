package com.example.ecomt.service;

import com.example.ecomt.entity.User;
import com.example.ecomt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUserProfile(String email, String name) {
        User user = getUserByEmail(email);
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }
        return userRepository.save(user);
    }
}
