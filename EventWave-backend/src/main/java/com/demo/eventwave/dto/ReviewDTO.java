package com.demo.eventwave.dto;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long reviewId;
    private Long eventId;
    private Long userId;
    private String userName;
   
    private String feedback;  // Only visible to organizer
    private LocalDateTime createdAt;
    private boolean showFeedback; // Indicates if feedback should be visible

    // Constructors
    public ReviewDTO() {
    }

    // Getters and Setters
    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    
    /**
     * Returns feedback only if showFeedback is true
     */
    public String getFeedback() {
        return showFeedback ? feedback : null;
    }

    /**
     * Sets the feedback content (always stored, visibility controlled by showFeedback)
     */
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isShowFeedback() {
        return showFeedback;
    }

    public void setShowFeedback(boolean showFeedback) {
        this.showFeedback = showFeedback;
    }

	public ReviewDTO(Long reviewId, Long eventId, Long userId, String userName, String feedback,
			LocalDateTime createdAt, boolean showFeedback) {
		super();
		this.reviewId = reviewId;
		this.eventId = eventId;
		this.userId = userId;
		this.userName = userName;
		this.feedback = feedback;
		this.createdAt = createdAt;
		this.showFeedback = showFeedback;
	}
    
}