package com.demo.eventwave.controller;

import com.demo.eventwave.entity.Role;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.UserRepository;
import com.demo.eventwave.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepo,
                          PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        logger.info("AuthController initialized");
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        logger.debug("Login attempt for username: {}", request.getUsername());

        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword()
                    )
            );

            UserDetails user = (UserDetails) authentication.getPrincipal();
            String role = user.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .orElse("UNKNOWN");

            logger.info("Successful login for user: {} with role: {}", request.getUsername(), role);
            return jwtUtil.generateToken(user.getUsername(), role);
        } catch (Exception e) {
            logger.error("Login failed for username: {}. Reason: {}", request.getUsername(), e.getMessage());
            throw new RuntimeException("Login failed", e);
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        logger.debug("Registration attempt for username: {}, email: {}", request.getUsername(), request.getEmail());

        if (userRepo.existsByUserName(request.getUsername())) {
            logger.warn("Registration failed - username already exists: {}", request.getUsername());
            throw new RuntimeException("Username already exists");
        }

        if (userRepo.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        try {
            User user = new User();
            user.setUserName(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());

            User savedUser = userRepo.save(user);
            logger.info("Successfully registered new user: {} with role: {}", savedUser.getUserName(), savedUser.getRole());

            return jwtUtil.generateToken(user.getUserName(), user.getRole().name());
        } catch (Exception e) {
            logger.error("Registration failed for username: {}. Error: {}", request.getUsername(), e.getMessage());
            throw new RuntimeException("Registration failed", e);
        }
    }

    static class AuthRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private Role role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }
}