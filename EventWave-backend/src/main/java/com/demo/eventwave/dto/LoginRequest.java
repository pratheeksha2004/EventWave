package com.demo.eventwave.dto;


public class LoginRequest {
    private String username;  // login by user_name now
    private String password;
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public LoginRequest(String username, String password) {
        super();
        this.username = username;
        this.password = password;
    }
    public LoginRequest() {
        super();
        // TODO Auto-generated constructor stub
    }




}
