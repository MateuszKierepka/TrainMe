package com.trainme.services;

import com.trainme.dtos.ForgotPasswordRequest;
import com.trainme.dtos.ResetPasswordRequest;
import com.trainme.entities.User;
import com.trainme.entities.VerificationToken;
import com.trainme.enums.TokenType;
import com.trainme.exceptions.InvalidTokenException;
import com.trainme.repositories.UserRepository;
import com.trainme.repositories.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final RateLimitService rateLimitService;

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request, String clientIp) {
        rateLimitService.check(
                "forgot-password:" + clientIp, 3, Duration.ofMinutes(10),
                "Zbyt wiele prób resetowania hasła. Spróbuj ponownie za kilka minut."
        );

        userRepository.findByEmail(request.email()).ifPresent(user -> {
            verificationTokenRepository.deleteByUserAndTokenType(user, TokenType.PASSWORD_RESET);

            String token = UUID.randomUUID().toString();
            VerificationToken resetToken = VerificationToken.builder()
                    .user(user)
                    .token(token)
                    .tokenType(TokenType.PASSWORD_RESET)
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .build();
            verificationTokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), token);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new IllegalArgumentException("Hasła nie są identyczne");
        }

        VerificationToken verificationToken = verificationTokenRepository.findByToken(request.token())
                .filter(vt -> vt.getTokenType() == TokenType.PASSWORD_RESET)
                .filter(vt -> vt.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(InvalidTokenException::new);

        User user = verificationToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
    }
}
