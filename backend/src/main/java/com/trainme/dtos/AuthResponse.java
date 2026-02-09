package com.trainme.dtos;

import com.trainme.enums.UserRole;

import java.util.UUID;

public record AuthResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        String photoUrl,
        boolean verified
) {}
