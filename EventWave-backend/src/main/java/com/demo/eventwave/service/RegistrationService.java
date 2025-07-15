package com.demo.eventwave.service;

import com.demo.eventwave.dto.EventDTO;
import com.demo.eventwave.dto.EventRegisterResponse;
import com.demo.eventwave.dto.UserDTO;
import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.Registration;
import com.demo.eventwave.entity.RegistrationStatus;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.EventRepository;
import com.demo.eventwave.repository.RegistrationRepository;
import com.demo.eventwave.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    // Updated: Now returns user and event details along with message
    public EventRegisterResponse registerUserForEvent(Long userId, Long eventId) {
        logger.info("Attempting to register user ID={} for event ID={}", userId, eventId);

        User user = userRepository.findById(userId).orElseThrow(() -> {
            logger.error("User with ID {} not found", userId);
            throw new RuntimeException("User not found.");
        });

        Event event = eventRepository.findById(eventId).orElseThrow(() -> {
            logger.error("Event with ID {} not found", eventId);
            throw new RuntimeException("Event not found.");
        });

        if (registrationRepository.findByUserAndEvent(user, event).isPresent()) {
            logger.warn("User {} already registered for event {}", userId, eventId);
            return new EventRegisterResponse("Already registered.", toUserDTO(user), toEventDTO(event));
        }

        long currentCount = registrationRepository.countByEvent(event);
        if (currentCount >= event.getCapacity()) {
            logger.warn("Event {} is full. Capacity: {}", eventId, event.getCapacity());
            return new EventRegisterResponse("Event is full.", toUserDTO(user), toEventDTO(event));
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(RegistrationStatus.CONFIRMED);
        registrationRepository.save(registration);

        logger.info("User {} ({}) registered for event {} ({})", 
            user.getUserName(), user.getEmail(), event.getTitle(), event.getLocation());

        return new EventRegisterResponse("Registration successful.", toUserDTO(user), toEventDTO(event));
    }

    public Optional<Registration> getRegistrationById(Long registrationId) {
        return registrationRepository.findById(registrationId);
    }

    public String unregisterUserFromEvent(Long userId, Long eventId) {
        logger.info("Attempting to unregister user ID={} from event ID={}", userId, eventId);

        User user = userRepository.findById(userId).orElseThrow(() -> {
            logger.error("User with ID {} not found", userId);
            return new RuntimeException("User not found.");
        });

        Event event = eventRepository.findById(eventId).orElseThrow(() -> {
            logger.error("Event with ID {} not found", eventId);
            return new RuntimeException("Event not found.");
        });

        Registration reg = registrationRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> {
                    logger.error("No registration found for user {} and event {}", userId, eventId);
                    return new RuntimeException("Registration not found.");
                });

        registrationRepository.delete(reg);
        logger.info("User {} successfully unregistered from event {}", userId, eventId);
        return "Unregistered successfully.";
    }

    public List<UserDTO> getAttendeesForEvent(Long eventId) {
        logger.info("Fetching attendees for event ID {}", eventId);

        Event event = eventRepository.findById(eventId).orElseThrow(() -> {
            logger.error("Event with ID {} not found", eventId);
            throw new RuntimeException("Event not found.");
        });

        List<UserDTO> attendees = registrationRepository.findByEvent(event)
                .stream()
                .map(reg -> new UserDTO(reg.getUser().getUserId(),
                        reg.getUser().getUserName(),
                        reg.getUser().getEmail()))
                .toList();

        logger.info("Found {} attendees for event {}", attendees.size(), eventId);
        return attendees;
    }

    // Helper methods to convert entity to DTO
    private UserDTO toUserDTO(User user) {
        return new UserDTO(user.getUserId(), user.getUserName(), user.getEmail());
    }

    private EventDTO toEventDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setPrice(event.getPrice());
        dto.setDateTime(event.getDateTime());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setImageUrl(event.getImageUrl());
        return dto;
    }
}
