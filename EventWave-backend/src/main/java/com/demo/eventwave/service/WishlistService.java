package com.demo.eventwave.service;

import com.demo.eventwave.dto.WishlistDTO;
import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.entity.Wishlist;
import com.demo.eventwave.repository.EventRepository;
import com.demo.eventwave.repository.UserRepository;
import com.demo.eventwave.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private static final Logger logger = LoggerFactory.getLogger(WishlistService.class);

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Transactional
    public String addToWishlist(Long userId, Long eventId) {
        logger.debug("Attempting to add event {} to wishlist for user {}", eventId, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event not found with ID: {}", eventId);
                    return new RuntimeException("Event not found");
                });

        if (wishlistRepository.existsByUserAndEvent(user, event)) {
            logger.warn("Event {} already exists in wishlist for user {}", eventId, userId);
            return "Event already in wishlist";
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setEvent(event);
        wishlist.setCreatedAt(LocalDateTime.now());

        wishlistRepository.save(wishlist);
        logger.info("Successfully added event {} to wishlist for user {}", eventId, userId);
        return "Event added to wishlist successfully";
    }

    @Transactional
    public String removeFromWishlist(Long userId, Long eventId) {
        logger.debug("Attempting to remove event {} from wishlist for user {}", eventId, userId);

        if (!wishlistRepository.existsByUserUserIdAndEventEventId(userId, eventId)) {
            logger.warn("Event {} not found in wishlist for user {}", eventId, userId);
            return "Event not found in wishlist";
        }

        wishlistRepository.deleteByUserUserIdAndEventEventId(userId, eventId);
        logger.info("Successfully removed event {} from wishlist for user {}", eventId, userId);
        return "Event removed from wishlist successfully";
    }

    public List<WishlistDTO> getUserWishlist(Long userId) {
        logger.debug("Fetching wishlist for user {}", userId);

        List<Wishlist> wishlists = wishlistRepository.findByUserUserId(userId);

        return wishlists.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private WishlistDTO convertToDTO(Wishlist wishlist) {
        Event event = wishlist.getEvent();
        WishlistDTO dto = new WishlistDTO();
        dto.setEventId(event.getEventId());
        dto.setEventTitle(event.getTitle());
        dto.setEventDate(event.getDateTime());
        dto.setEventLocation(event.getLocation());
        dto.setAddedAt(wishlist.getCreatedAt());
        return dto;
    }
}
