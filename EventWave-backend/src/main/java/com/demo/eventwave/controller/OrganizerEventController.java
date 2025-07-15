package com.demo.eventwave.controller;

import com.demo.eventwave.dto.EventDTO;
import com.demo.eventwave.dto.ReviewDTO;
import com.demo.eventwave.dto.ReviewSummaryDTO;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.UserRepository;
import com.demo.eventwave.service.OrganizerEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/events")
public class OrganizerEventController {

    private static final Logger logger = LoggerFactory.getLogger(OrganizerEventController.class);

    private final OrganizerEventService organizerEventService;
    private final UserRepository userRepository;

    @Autowired
    public OrganizerEventController(OrganizerEventService organizerEventService,
                                    UserRepository userRepository) {
        this.organizerEventService = organizerEventService;
        this.userRepository = userRepository;
        logger.info("OrganizerEventController initialized");
    }


//Creates a new event for the authenticated organizer
    @PostMapping
    public ResponseEntity<?> createEvent(
            @RequestBody EventDTO eventDTO,
            Authentication authentication) {


        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
        }

        String username = authentication.getName();
        User organizer = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    return new RuntimeException("Organizer not found");
                });

        EventDTO createdEvent = organizerEventService.createEvent(eventDTO, organizer.getUserId());
        logger.info("Successfully created event with ID: {}", createdEvent.getEventId());
        return ResponseEntity.ok(createdEvent);
    }

    //Retrieves all events created by the current organizer
    @GetMapping("/my-events")
    public ResponseEntity<List<EventDTO>> getMyEvents(@AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Fetching events for organizer");

        String username = userDetails.getUsername();
        User organizer = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("Organizer not found with username: {}", username);
                    return new RuntimeException("Organizer not found");
                });

        List<EventDTO> events = organizerEventService.getEventsByOrganizer(organizer.getUserId());
        logger.info("Found {} events for organizer: {}", events.size(), username);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEventByIdDirect(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println(">>>> Inside getEventById (direct) <<<<");

        String username = userDetails.getUsername();
        User organizer = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        EventDTO event = organizerEventService.getEventByIdForOrganizer(eventId, organizer.getUserId());

        if (event == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(event);
    }




//Updates an existing event owned by the current organizer
    @PutMapping("/{eventId}")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable Long eventId,
            @RequestBody EventDTO eventDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        logger.debug("Attempting to update event with ID: {}", eventId);

        String username = userDetails.getUsername();
        User organizer = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("Organizer not found with username: {}", username);
                    return new RuntimeException("Organizer not found");
                });

        EventDTO updatedEvent = organizerEventService.updateEvent(eventId, eventDTO, organizer.getUserId());
        logger.info("Successfully updated event with ID: {}", eventId);
        return ResponseEntity.ok(updatedEvent);
    }
    
 

    //Deletes an event owned by the current organizer
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {


        String username = userDetails.getUsername();
        User organizer = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("Organizer not found with username: {}", username);
                    return new RuntimeException("Organizer not found");
                });

        organizerEventService.deleteEvent(eventId, organizer.getUserId());
        logger.info("Successfully deleted event with ID: {}", eventId);
        return ResponseEntity.noContent().build();
    }


//Gets all reviews for an event including organizer's feedback responses
    @GetMapping("/{eventId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getEventReviewsWithFeedback(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ReviewDTO> reviews = organizerEventService.getEventReviewsWithFeedback(
                eventId,
                userDetails.getUsername()
        );
        return ResponseEntity.ok(reviews);
    }

    //Gets aggregated review statistics for an event
    @GetMapping("/{eventId}/reviews/summary")
    public ResponseEntity<ReviewSummaryDTO> getEventReviewSummary(
            @PathVariable Long eventId) {

        ReviewSummaryDTO summary = organizerEventService.getEventReviewSummary(eventId);
        return ResponseEntity.ok(summary);
    }
}