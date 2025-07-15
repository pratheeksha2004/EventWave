package com.demo.eventwave.repository;

import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.Review;
import com.demo.eventwave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews for a specific event
    List<Review> findByEvent_EventId(Long eventId);

    // Count reviews for an event
    Integer countByEvent_EventId(Long eventId);

    // Check if a user has reviewed an event
    boolean existsByEventAndUser(Event event, User user);

}
