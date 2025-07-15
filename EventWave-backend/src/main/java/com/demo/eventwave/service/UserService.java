package com.demo.eventwave.service;

import com.demo.eventwave.dto.UserDTO;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 👁️ Get user details by username
    public UserDTO getUserDetails(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(user.getUserId(), user.getUserName(), user.getEmail()); // Don't expose password
    }

    // ✏️ Update user email or password
    public void updateUserDetails(String username, UserDTO dto) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update email if provided
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user.setEmail(dto.getEmail());
        }



        // Optionally update name
        if (dto.getUserName() != null && !dto.getUserName().isBlank()) {
            user.setUserName(dto.getUserName());
        }

        userRepository.save(user);
    }
}


