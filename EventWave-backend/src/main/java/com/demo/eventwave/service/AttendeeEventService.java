package com.demo.eventwave.service;

import com.demo.eventwave.dto.EventDTO;
import com.demo.eventwave.dto.ReviewDTO;
import com.demo.eventwave.entity.*;
import com.demo.eventwave.repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendeeEventService {

    private static final Logger logger = LoggerFactory.getLogger(AttendeeEventService.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    // Basic version without wishlist status
    private EventDTO toDto(Event event) {
        logger.debug("Converting Event to DTO (basic version) - Event ID: {}", event.getEventId());
        EventDTO dto = new EventDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setDateTime(event.getDateTime());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setPrice(event.getPrice());
        dto.setOrganizerId(event.getOrganizer().getUserId());
        dto.setOrganizerName(event.getOrganizer().getUserName());
        dto.setCategory(event.getCategory());
        dto.setImageUrl(event.getImageUrl());
        dto.setInWishlist(null);
       
        logger.debug("Basic DTO conversion complete for Event ID: {}", event.getEventId());
        return dto;
    }

    // Enhanced version with wishlist status
    private EventDTO toDto(Event event, String username) {
        logger.debug("Converting Event to DTO with wishlist status - Event ID: {}, Username: {}",
                event.getEventId(), username);

        EventDTO dto = toDto(event); // Start with basic conversion

        if (username != null) {
            User user = userRepository.findByUserName(username).orElse(null);
            if (user != null) {
                boolean inWishlist = wishlistRepository.existsByUserUserIdAndEventEventId(
                        user.getUserId(),
                        event.getEventId()
                );
                dto.setInWishlist(inWishlist);
                logger.debug("Wishlist status for Event ID {}: {}", event.getEventId(), inWishlist);
            }
        }
        return dto;
    }

    public EventDTO getEventById(Long eventId, String username) {
        logger.debug("Fetching event by ID: {} for user: {}", eventId, username);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event not found with ID: {}", eventId);
                    return new RuntimeException("Event not found");
                });
        return username != null ? toDto(event, username) : toDto(event);
    }

    public List<EventDTO> getAllEvents(String username) {
        logger.debug("Fetching all events for user: {}", username);
        return eventRepository.findAll().stream()
                .map(event -> username != null ? toDto(event, username) : toDto(event))
                .collect(Collectors.toList());
    }

    public List<EventDTO> searchEventsByTitle(String title) {
        logger.debug("Searching events by title: {}", title);
        return eventRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EventDTO> searchEventsByDescription(String description) {
        logger.debug("Searching events by description containing: {}", description);
        return eventRepository.findByDescriptionContainingIgnoreCase(description).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EventDTO> filterByLocation(String location) {
        logger.debug("Filtering events by location: {}", location);
        return eventRepository.findByLocationContainingIgnoreCase(location).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EventDTO> filterByDateRange(LocalDateTime start, LocalDateTime end) {
        logger.debug("Filtering events between {} and {}", start, end);
        return eventRepository.findByDateTimeBetween(start, end).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsRegisteredByUser(String username) {
        logger.debug("Fetching registered events for user: {}", username);
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("User not found with username: {}", username);
                    return new RuntimeException("User not found");
                });

        return registrationRepository.findByUser(user).stream()
                .map(registration -> toDto(registration.getEvent(), username))
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByCategory(EventCategory category) {
        logger.debug("Fetching events by category: {}", category);
        return eventRepository.findByCategory(category).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(Long eventId, String username, String feedback) {
        logger.debug("Creating review for event ID: {} by user: {}", eventId, username);

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getDateTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot review future events");
        }

        if (!registrationRepository.existsByUserAndEventAndStatus(user, event, RegistrationStatus.CONFIRMED)) {
            throw new IllegalArgumentException("You must attend the event to leave a review");
        }

        if (reviewRepository.existsByEventAndUser(event, user)) {
            throw new IllegalArgumentException("You've already reviewed this event");
        }

        Review review = new Review();
        review.setEvent(event);
        review.setUser(user);
        review.setFeedback(feedback);
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        return convertToReviewDTO(savedReview, true);
    }


    public List<ReviewDTO> getEventReviews(Long eventId, boolean showFeedback) {
        logger.debug("Fetching reviews for event ID: {}, showFeedback: {}", eventId, showFeedback);
        return reviewRepository.findByEvent_EventId(eventId).stream()
                .map(review -> convertToReviewDTO(review, showFeedback))
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToReviewDTO(Review review, boolean showFeedback) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setEventId(review.getEvent().getEventId());
        dto.setUserId(review.getUser().getUserId());
        dto.setUserName(review.getUser().getUserName());
        
        dto.setFeedback(showFeedback ? review.getFeedback() : null);
        dto.setCreatedAt(review.getCreatedAt());
        dto.setShowFeedback(showFeedback);
        return dto;
    }
}
