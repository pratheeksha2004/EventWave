package com.demo.eventwave.dto;

public class ReviewSummaryDTO {
    private Long eventId;
    private double averageRating;
    private int totalReviews;

    // Constructors, getters, setters
    public ReviewSummaryDTO() {}

    public ReviewSummaryDTO(Long eventId, double averageRating, int totalReviews) {
        this.eventId = eventId;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    // Getters and setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(int totalReviews) {
        this.totalReviews = totalReviews;
    }
}