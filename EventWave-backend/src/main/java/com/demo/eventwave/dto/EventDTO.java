package com.demo.eventwave.dto;

import com.demo.eventwave.entity.EventCategory;
import com.demo.eventwave.entity.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventDTO {
    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
    private Integer capacity;
    private BigDecimal price;
    private Long organizerId;
    private String organizerName;
    private EventCategory category;
    private Double averageRating;
    private Integer reviewCount;
    private String imageUrl;


    // Constructors
    public EventDTO() {
    }

    public EventDTO(Long eventId, String title, String description, LocalDateTime dateTime,
                    String location, Integer capacity, BigDecimal price,
                    User organizer, EventCategory category, String imageUrl) {
        this.eventId = eventId;
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.location = location;
        this.capacity = capacity;
        this.price = price;
        this.organizerId = organizer.getUserId();
        this.organizerName = organizer.getUserName();
        this.category = category;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public EventCategory getCategory() {
        return category;
    }

    public void setCategory(EventCategory category) {
        this.category = category;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    // Add this field to EventDTO.java
    private Boolean inWishlist;

    // Add getter and setter
    public Boolean getInWishlist() {
        return inWishlist;
    }

    public void setInWishlist(Boolean inWishlist) {
        this.inWishlist = inWishlist;
    }

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
    
}
