package com.demo.eventwave.repository;

import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.EventCategory;
import com.demo.eventwave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Search methods
    List<Event> findByTitleContainingIgnoreCase(String title);
    List<Event> findByDescriptionContainingIgnoreCase(String description);

    // Filter methods
    List<Event> findByLocationContainingIgnoreCase(String location);
    List<Event> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);



    // Organizer-related
    List<Event> findByOrganizer(User organizer);
    long countByOrganizer(User organizer);

    List<Event> findByCategory(EventCategory category);


}