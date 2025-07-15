package com.demo.eventwave.controller;

import com.demo.eventwave.dto.EventDTO;
import com.demo.eventwave.dto.ReviewDTO;
import com.demo.eventwave.dto.ReviewRequest;
import com.demo.eventwave.entity.EventCategory;
import com.demo.eventwave.service.AttendeeEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/attendee/events")
public class AttendeeEventController {

    private static final Logger logger = LoggerFactory.getLogger(AttendeeEventController.class);

    private final AttendeeEventService attendeeEventService;

    @Autowired
    public AttendeeEventController(AttendeeEventService attendeeEventService) {
        this.attendeeEventService = attendeeEventService;
    }

    // ✅ 1. Get registered events for logged-in user
    @GetMapping("/my-registrations")
    public ResponseEntity<List<EventDTO>> getMyRegisteredEvents(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthenticated access attempt to /my-registrations");
            return ResponseEntity.status(401).build();
        }
        String username = userDetails.getUsername();
        logger.debug("Fetching registered events for user: {}", userDetails.getUsername());
        List<EventDTO> events = attendeeEventService.getEventsRegisteredByUser(userDetails.getUsername());
        logger.info("Found {} registered events for user: {}", events.size(), userDetails.getUsername());
        return ResponseEntity.ok(events);
    }

    // ✅ 2. Get specific event by ID
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long eventId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        logger.debug("Fetching event by ID: {} for user: {}", eventId, username);

        EventDTO event = attendeeEventService.getEventById(eventId, username);
        if (event == null) {
            logger.warn("Event not found with ID: {}", eventId);
            return ResponseEntity.notFound().build();
        }

        logger.info("Successfully retrieved event with ID: {}", eventId);
        return ResponseEntity.ok(event);
    }

    // ✅ 3. Get all events
    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        logger.debug("Fetching all events for user: {}", username);

        List<EventDTO> events = attendeeEventService.getAllEvents(username);
        logger.info("Retrieved {} events", events.size());
        return ResponseEntity.ok(events);
    }

    // ✅ 4. Search events by title
    @GetMapping("/search/title/{title}")
    public ResponseEntity<List<EventDTO>> searchEventsByTitle(@PathVariable String title) {
        logger.debug("Searching events by title: {}", title);
        List<EventDTO> events = attendeeEventService.searchEventsByTitle(title);
        logger.info("Found {} events matching title: {}", events.size(), title);
        return ResponseEntity.ok(events);
    }

    // ✅ 5. Search events by description
    @GetMapping("/search/description/{description}")
    public ResponseEntity<List<EventDTO>> searchEventsByDescription(@PathVariable String description) {
        logger.debug("Searching events by description containing: {}", description);
        List<EventDTO> events = attendeeEventService.searchEventsByDescription(description);
        logger.info("Found {} events matching description", events.size());
        return ResponseEntity.ok(events);
    }

    // ✅ 6. Filter events by location
    @GetMapping("/filter/location/{location}")
    public ResponseEntity<List<EventDTO>> filterByLocation(@PathVariable String location) {
        logger.debug("Filtering events by location: {}", location);
        List<EventDTO> events = attendeeEventService.filterByLocation(location);
        logger.info("Found {} events in location: {}", events.size(), location);
        return ResponseEntity.ok(events);
    }

    // ✅ 7. Filter events by date range
    @GetMapping("/filter/date-range")
    public ResponseEntity<List<EventDTO>> filterByDateRange(@RequestParam LocalDateTime start,
                                                             @RequestParam LocalDateTime end) {
        logger.debug("Filtering events between {} and {}", start, end);
        List<EventDTO> events = attendeeEventService.filterByDateRange(start, end);
        logger.info("Found {} events in date range", events.size());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<EventDTO>> getEventsByCategory(@PathVariable String category) {
        try {
            EventCategory eventCategory = EventCategory.valueOf(category.toUpperCase().replace(" ", "_"));
            List<EventDTO> events = attendeeEventService.getEventsByCategory(eventCategory);
            return events.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(events);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }


 // ✅ 9. Submit review for an event
    @PostMapping("/{eventId}/reviews")
    public ResponseEntity<ReviewDTO> createReview(@PathVariable Long eventId,
                                                  @RequestBody ReviewRequest reviewRequest,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthenticated attempt to submit review");
            return ResponseEntity.status(401).build();
        }

        String feedback = reviewRequest.getFeedback();

        ReviewDTO review = attendeeEventService.createReview(eventId, userDetails.getUsername(), feedback);
        logger.info("Review created for event {} by user {}", eventId, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }


    // ✅ 10. Get all reviews for an event
    @GetMapping("/{eventId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getEventReviews(@PathVariable Long eventId) {
        List<ReviewDTO> reviews = attendeeEventService.getEventReviews(eventId, false);
        logger.info("Found {} reviews for event ID {}", reviews.size(), eventId);
        return ResponseEntity.ok(reviews);
    }
}
