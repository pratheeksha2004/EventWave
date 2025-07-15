package com.demo.eventwave.repository;

import java.util.List;
import java.util.Optional;

import com.demo.eventwave.entity.RegistrationStatus;
import com.demo.eventwave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Optional<Registration> findByUserAndEvent(User user, Event event);
    Optional<Registration> findByUser_UserIdAndEvent_EventId(Long userId, Long eventId);
    List<Registration> findByEvent(Event event);
    long countByEvent(Event event);
    List<Registration> findByUser(User user);


    boolean existsByUserAndEventAndStatus(User user, Event event, RegistrationStatus status);
    
    
}