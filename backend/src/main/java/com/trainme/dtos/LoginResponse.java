package com.trainme.dtos;

public record LoginResponse(
        String token, 
        AuthResponse user
) {}
