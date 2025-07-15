package com.demo.eventwave.repository;

import com.demo.eventwave.entity.Event;
import com.demo.eventwave.entity.User;
import com.demo.eventwave.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserUserId(Long userId);
    boolean existsByUserUserIdAndEventEventId(Long userId, Long eventId);
    void deleteByUserUserIdAndEventEventId(Long userId, Long eventId);
    boolean existsByUserAndEvent(User user, Event event);
}