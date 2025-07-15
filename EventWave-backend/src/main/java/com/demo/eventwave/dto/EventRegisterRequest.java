package com.demo.eventwave.dto;

public class EventRegisterRequest {
    private Long eventId;

    public EventRegisterRequest() {}

    public EventRegisterRequest(Long eventId) {
        this.eventId = eventId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
