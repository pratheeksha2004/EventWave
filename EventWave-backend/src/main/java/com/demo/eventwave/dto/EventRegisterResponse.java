package com.demo.eventwave.dto;

public class EventRegisterResponse {
	 private String message;
	    private UserDTO user;
	    private EventDTO event;
		public String getMessage() {
			return message;
		}
		public void setMessage(String message) {
			this.message = message;
		}
		public UserDTO getUser() {
			return user;
		}
		public void setUser(UserDTO user) {
			this.user = user;
		}
		public EventDTO getEvent() {
			return event;
		}
		public void setEvent(EventDTO event) {
			this.event = event;
		}
		public EventRegisterResponse(String message, UserDTO user, EventDTO event) {
			super();
			this.message = message;
			this.user = user;
			this.event = event;
		}
		public EventRegisterResponse() {
			super();
			// TODO Auto-generated constructor stub
		}


}
