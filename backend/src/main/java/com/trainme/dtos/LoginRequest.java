package com.trainme.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Adres e-mail jest wymagany")
        @Email(message = "Wprowadź poprawny adres e-mail")
        String email,

        @NotBlank(message = "Hasło jest wymagane")
        String password
) {}
