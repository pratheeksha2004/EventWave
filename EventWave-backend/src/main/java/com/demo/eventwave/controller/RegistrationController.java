package com.demo.eventwave.controller;



import java.util.List;
import java.util.Optional;

import com.demo.eventwave.dto.EventRegisterRequest;
import com.demo.eventwave.dto.EventRegisterResponse;
import com.demo.eventwave.dto.RegisterRequest;
import com.demo.eventwave.dto.UserDTO;
import com.demo.eventwave.entity.Registration;
import com.demo.eventwave.service.RegistrationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")  // Base URL for all registration-related endpoints
public class RegistrationController {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationController.class); // Logger instance

    @Autowired  // Inject the RegistrationService to handle the business logic
    private RegistrationService registrationService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<EventRegisterResponse> register(
        @PathVariable Long userId,
        @RequestBody EventRegisterRequest request
    ) {
        logger.info("Received registration request for userId={} and eventId={}", userId, request.getEventId());
        EventRegisterResponse response = registrationService.registerUserForEvent(userId, request.getEventId());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{registrationId}")
    public ResponseEntity<?> getRegistrationById(@PathVariable Long registrationId, @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        logger.info("Fetching registration with ID: {}", registrationId);

        Optional<Registration> registrationOptional = registrationService.getRegistrationById(registrationId);

        if (registrationOptional.isEmpty()) {
            logger.warn("Registration not found for ID: {}", registrationId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registration not found.");
        }

        Registration registration = registrationOptional.get();

        String usernameFromToken = userDetails.getUsername();

        // Ensure that only the owner or organizer accesses this
        if (!registration.getUser().getEmail().equals(usernameFromToken)
                && !userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ORGANIZER"))) {
            logger.warn("Access denied for user: {}", usernameFromToken);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access this registration.");
        }

        return ResponseEntity.ok(registration);
    }




    @PostMapping("/unregister")  // Endpoint to unregister a user from an event
    public ResponseEntity<String> unregister(@RequestBody RegisterRequest request) {
        logger.info("Received unregistration request for userId={} and eventId={}", request.getUserId(), request.getEventId());
        String message = registrationService.unregisterUserFromEvent(request.getUserId(), request.getEventId());
        logger.info("Unregistration result: {}", message);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/attendees/{eventId}")  // Endpoint to fetch attendees for a given event
    public ResponseEntity<List<UserDTO>> getAttendees(@PathVariable Long eventId) {
        logger.info("Fetching attendees for eventId={}", eventId);
        List<UserDTO> attendees = registrationService.getAttendeesForEvent(eventId);
        logger.info("Number of attendees found: {}", attendees.size());
        return ResponseEntity.ok(attendees);
    }
}
