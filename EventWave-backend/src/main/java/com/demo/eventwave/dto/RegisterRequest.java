package com.demo.eventwave.dto;


import com.demo.eventwave.entity.Role;

public class RegisterRequest {
    private Long userId;
    private Long eventId;
    private String userName;  // corresponds to user_name in DB
    private String email;
    private String password;
    private Role role;

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public RegisterRequest(Long userId, Long eventId, String userName, String email, String password, Role role) {
        super();
        this.userId = userId;
        this.eventId = eventId;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    public RegisterRequest() {
        super();
        // TODO Auto-generated constructor stub
    }


}
