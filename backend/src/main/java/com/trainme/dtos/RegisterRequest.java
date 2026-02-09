package com.trainme.dtos;

import com.trainme.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank(message = "Adres e-mail jest wymagany")
        @Email(message = "Wprowadź poprawny adres e-mail")
        String email,

        @NotBlank(message = "Hasło jest wymagane")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$",
                message = "Min. 8 znaków, 1 duża litera, 1 mała litera, 1 cyfra, 1 znak specjalny"
        )
        String password,

        @NotBlank(message = "Potwierdzenie hasła jest wymagane")
        String confirmPassword,

        @NotNull(message = "Wybierz typ konta")
        UserRole role,

        @NotNull(message = "Data urodzenia jest wymagana")
        @Past(message = "Data urodzenia musi być w przeszłości")
        LocalDate dateOfBirth,

        @NotBlank(message = "Imię jest wymagane")
        @Size(min = 2, max = 20, message = "Imię musi mieć od 2 do 20 znaków")
        @Pattern(
                regexp = "^[A-ZŁŚŹŻĆŃÓĘ].*",
                message = "Imię musi zaczynać się od dużej litery"
        )
        @Pattern(
                regexp = "^[a-złśźżćńóęA-ZŁŚŹŻĆŃÓĘ]+$",
                message = "Imię może zawierać tylko litery"
        )
        String firstName,

        @NotBlank(message = "Nazwisko jest wymagane")
        @Size(min = 2, max = 35, message = "Nazwisko musi mieć od 2 do 35 znaków")
        @Pattern(
                regexp = "^[A-ZŁŚŹŻĆŃÓĘ].*",
                message = "Nazwisko musi zaczynać się od dużej litery"
        )
        @Pattern(
                regexp = "^[a-złśźżćńóęA-ZŁŚŹŻĆŃÓĘ-]+$",
                message = "Nazwisko może zawierać tylko litery i myślnik"
        )
        String lastName,

        @NotBlank(message = "Numer telefonu jest wymagany")
        @Pattern(regexp = "^\\d{9}$", message = "Numer telefonu musi mieć dokładnie 9 cyfr")
        String phoneNumber
) {}
