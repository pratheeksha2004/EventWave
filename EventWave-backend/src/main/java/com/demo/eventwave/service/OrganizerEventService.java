package com.demo.eventwave.service;

import com.demo.eventwave.dto.EventDTO;
import com.demo.eventwave.dto.ReviewDTO;
import com.demo.eventwave.dto.ReviewSummaryDTO;
import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.Review;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.repository.EventRepository;
import com.demo.eventwave.repository.ReviewRepository;
import com.demo.eventwave.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizerEventService {

    private static final Logger logger = LoggerFactory.getLogger(OrganizerEventService.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;
    
    public EventDTO getEventByIdForOrganizer(Long eventId, Long organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElse(null);

        if (event == null || !event.getOrganizer().getUserId().equals(organizerId)) {
            logger.warn("Event not found or unauthorized access: eventId={}, organizerId={}", eventId, organizerId);
            return null;
        }

        return toDto(event);
    }


    public EventDTO createEvent(EventDTO eventDTO, Long organizerId) {
        logger.info("Creating event by organizer ID: {}", organizerId);
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> {
                    logger.error("Organizer with ID {} not found", organizerId);
                    return new RuntimeException("Organizer not found");
                });

        if (eventDTO.getCategory() == null) {
            logger.warn("Event category is null during creation");
            throw new IllegalArgumentException("Event category is required");
        }

        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setDateTime(eventDTO.getDateTime());
        event.setLocation(eventDTO.getLocation());
        event.setCapacity(eventDTO.getCapacity());
        event.setPrice(eventDTO.getPrice());
        event.setOrganizer(organizer);
        event.setCategory(eventDTO.getCategory());
        event.setImageUrl(eventDTO.getImageUrl());


        Event savedEvent = eventRepository.save(event);
        logger.info("Event created successfully with ID: {}", savedEvent.getEventId());
        return toDto(savedEvent);
    }

    public EventDTO updateEvent(Long eventId, EventDTO eventDTO, Long organizerId) {
        logger.info("Updating event ID: {} by organizer ID: {}", eventId, organizerId);
        Event existing = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });

        if (!existing.getOrganizer().getUserId().equals(organizerId)) {
            logger.error("Unauthorized update attempt by organizer ID: {}", organizerId);
            throw new RuntimeException("Only organizer can modify this event");
        }

        existing.setTitle(eventDTO.getTitle());
        existing.setDescription(eventDTO.getDescription());
        existing.setDateTime(eventDTO.getDateTime());
        existing.setLocation(eventDTO.getLocation());
        existing.setCapacity(eventDTO.getCapacity());
        existing.setPrice(eventDTO.getPrice());
        existing.setCategory(eventDTO.getCategory());
        existing.setImageUrl(eventDTO.getImageUrl());


        Event updatedEvent = eventRepository.save(existing);
        logger.info("Event updated successfully: ID {}", updatedEvent.getEventId());
        return toDto(updatedEvent);
    }

    public void deleteEvent(Long eventId, Long organizerId) {
        logger.info("Deleting event ID: {} by organizer ID: {}", eventId, organizerId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });

        if (!event.getOrganizer().getUserId().equals(organizerId)) {
            logger.error("Unauthorized deletion attempt by organizer ID: {}", organizerId);
            throw new RuntimeException("Only organizer can delete this event");
        }

        eventRepository.delete(event);
        logger.info("Event deleted successfully: ID {}", eventId);
    }

    public List<EventDTO> getEventsByOrganizer(Long organizerId) {
        logger.info("Fetching events for organizer ID: {}", organizerId);
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> {
                    logger.error("Organizer with ID {} not found", organizerId);
                    return new RuntimeException("Organizer not found");
                });

        List<EventDTO> events = eventRepository.findByOrganizer(organizer).stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        logger.info("Found {} events for organizer ID: {}", events.size(), organizerId);
        return events;
    }

    public List<ReviewDTO> getEventReviewsWithFeedback(Long eventId, String username) {
        logger.info("Fetching reviews with feedback for event ID: {} by organizer username: {}", eventId, username);
        User organizer = userRepository.findByUserName(username)
                .orElseThrow(() -> {
                    logger.error("User with username {} not found", username);
                    return new RuntimeException("User not found");
                });

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });

        if (!event.getOrganizer().equals(organizer)) {
            logger.error("Unauthorized access to reviews by username: {}", username);
            throw new RuntimeException("Only the event organizer can view feedback");
        }

        List<ReviewDTO> reviews = reviewRepository.findByEvent_EventId(eventId).stream()
                .map(review -> convertToReviewDTO(review, true))
                .collect(Collectors.toList());

        logger.info("Found {} reviews for event ID: {}", reviews.size(), eventId);
        return reviews;
    }

    public ReviewSummaryDTO getEventReviewSummary(Long eventId) {
        logger.info("Fetching review summary for event ID: {}", eventId);

        Integer totalReviews = reviewRepository.countByEvent_EventId(eventId);

        logger.info("Summary - Event ID: {}, Total Reviews: {}", eventId, totalReviews != null ? totalReviews : 0);

        return new ReviewSummaryDTO(
                eventId,
                0.0, // No rating, so default to 0.0
                totalReviews != null ? totalReviews : 0
        );
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

    private EventDTO toDto(Event event) {
        EventDTO dto = new EventDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setDateTime(event.getDateTime());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setPrice(event.getPrice());
        dto.setCategory(event.getCategory());
        dto.setOrganizerId(event.getOrganizer().getUserId());
        dto.setOrganizerName(event.getOrganizer().getUserName());
        dto.setImageUrl(event.getImageUrl());

        ReviewSummaryDTO summary = getEventReviewSummary(event.getEventId());
        dto.setAverageRating(summary.getAverageRating());
        dto.setReviewCount(summary.getTotalReviews());

        return dto;
    }
}
