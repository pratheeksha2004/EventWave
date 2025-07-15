package com.demo.eventwave.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDTO {
    private Long eventId;
    private String eventTitle;
    private LocalDateTime eventDate;
    private String eventLocation;
    private LocalDateTime addedAt;
	public Long getEventId() {
		return eventId;
	}
	public void setEventId(Long eventId) {
		this.eventId = eventId;
	}
	public String getEventTitle() {
		return eventTitle;
	}
	public void setEventTitle(String eventTitle) {
		this.eventTitle = eventTitle;
	}
	public LocalDateTime getEventDate() {
		return eventDate;
	}
	public void setEventDate(LocalDateTime eventDate) {
		this.eventDate = eventDate;
	}
	public String getEventLocation() {
		return eventLocation;
	}
	public void setEventLocation(String eventLocation) {
		this.eventLocation = eventLocation;
	}
	public LocalDateTime getAddedAt() {
		return addedAt;
	}
	public void setAddedAt(LocalDateTime addedAt) {
		this.addedAt = addedAt;
	}
	public WishlistDTO(Long eventId, String eventTitle, LocalDateTime eventDate, String eventLocation,
			LocalDateTime addedAt) {
		super();
		this.eventId = eventId;
		this.eventTitle = eventTitle;
		this.eventDate = eventDate;
		this.eventLocation = eventLocation;
		this.addedAt = addedAt;
	}
	public WishlistDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
    
}