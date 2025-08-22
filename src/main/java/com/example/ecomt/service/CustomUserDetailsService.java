package com.example.ecomt.service;

import com.example.ecomt.entity.User;
import com.example.ecomt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Collection<? extends GrantedAuthority> authorities = getAuthorities(user);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities);
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        User.Role userRole = user.getRole();
        if (userRole == null) {
            userRole = User.Role.USER;
        }

        String roleWithPrefix = "ROLE_" + userRole.name().toUpperCase();
        return Collections.singletonList(new SimpleGrantedAuthority(roleWithPrefix));
    }
}
