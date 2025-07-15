package com.demo.eventwave.controller;

import com.demo.eventwave.dto.WishlistDTO;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.UserRepository;
import com.demo.eventwave.service.WishlistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendee/wishlist")
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{eventId}")
    public ResponseEntity<String> addToWishlist(
            @PathVariable Long eventId,
            Authentication authentication) {

        String username = authentication.getName();  // ✅ JWT-safe
        logger.debug("Adding event {} to wishlist for user {}", eventId, username);

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("User not found with username: {}", username);
                    return new RuntimeException("User not found");
                });

        String result = wishlistService.addToWishlist(user.getUserId(), eventId);
        logger.info("Wishlist addition result: {}", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long eventId,
            Authentication authentication) {

        String username = authentication.getName();
        logger.debug("Removing event {} from wishlist for user {}", eventId, username);

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("User not found with username: {}", username);
                    return new RuntimeException("User not found");
                });

        String result = wishlistService.removeFromWishlist(user.getUserId(), eventId);
        logger.info("Wishlist removal result: {}", result);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<WishlistDTO>> getUserWishlist(
            Authentication authentication) {

        String username = authentication.getName();
        logger.debug("Fetching wishlist for user {}", username);

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("User not found with username: {}", username);
                    return new RuntimeException("User not found");
                });

        List<WishlistDTO> wishlist = wishlistService.getUserWishlist(user.getUserId());
        logger.info("Found {} items in wishlist for user {}", wishlist.size(), username);
        return ResponseEntity.ok(wishlist);
    }
}
