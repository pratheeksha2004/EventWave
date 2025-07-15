package com.demo.eventwave.config;

import com.demo.eventwave.entity.Role;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataConfig {

    @Bean
    CommandLineRunner run(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.findByUserName("testorganizer").isEmpty()) {
                User user = new User();
                user.setUserName("testorganizer");
                user.setEmail("testuser@example.com");
                user.setPassword(encoder.encode("password123"));
                user.setRole(Role.ORGANIZER);
                repo.save(user);
                System.out.println("✅ Test user created: testorganizer / password123");
            }
        };
    }
}