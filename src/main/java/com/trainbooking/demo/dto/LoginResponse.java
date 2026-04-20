package com.trainbooking.demo.dto;

public class LoginResponse {

    private String token;
    private Integer userId;
    private String name;
    private String email;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(String token, Integer userId, String name, String email, String message) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}