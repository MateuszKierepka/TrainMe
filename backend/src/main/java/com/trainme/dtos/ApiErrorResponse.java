package com.trainme.dtos;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiErrorResponse(
        int status,
        String message,
        Map<String, String> errors,
        LocalDateTime timestamp
) {
    public ApiErrorResponse(int status, String message) {
        this(status, message, Map.of(), LocalDateTime.now());
    }

    public ApiErrorResponse(int status, String message, Map<String, String> errors) {
        this(status, message, errors, LocalDateTime.now());
    }
}
