package com.trainme.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token jest wymagany")
        String token,

        @NotBlank(message = "Hasło jest wymagane")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$",
                message = "Min. 8 znaków, 1 duża litera, 1 mała litera, 1 cyfra, 1 znak specjalny"
        )
        @Size(max = 128, message = "Hasło może mieć maksymalnie 128 znaków")
        String newPassword,

        @NotBlank(message = "Potwierdzenie hasła jest wymagane")
        String confirmNewPassword
) {}
