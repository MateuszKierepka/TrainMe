package com.trainme.services;

import com.trainme.dtos.ResendVerificationRequest;
import com.trainme.entities.User;
import com.trainme.entities.VerificationToken;
import com.trainme.enums.TokenType;
import com.trainme.exceptions.InvalidTokenException;
import com.trainme.exceptions.TooManyRequestsException;
import com.trainme.repositories.UserRepository;
import com.trainme.repositories.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final RateLimitService rateLimitService;

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .filter(vt -> vt.getTokenType() == TokenType.EMAIL_VERIFICATION)
                .filter(vt -> vt.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(InvalidTokenException::new);

        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
    }

    @Transactional
    public void resendVerification(ResendVerificationRequest request, String clientIp) {
        rateLimitService.check(
                "resend-verification:" + clientIp, 2, Duration.ofMinutes(10),
                "Zbyt wiele prób wysłania emaila weryfikacyjnego. Spróbuj ponownie za kilka minut."
        );

        userRepository.findByEmailAndVerifiedFalse(request.email()).ifPresent(user -> {
            verificationTokenRepository.findByUserAndTokenType(user, TokenType.EMAIL_VERIFICATION)
                    .ifPresent(existingToken -> {
                        LocalDateTime cooldownThreshold = LocalDateTime.now().minusMinutes(5);
                        if (existingToken.getCreatedAt().isAfter(cooldownThreshold)) {
                            throw new TooManyRequestsException(
                                    "Email weryfikacyjny został niedawno wysłany. Odczekaj 5 minut pomiędzy kolejnymi próbami."
                            );
                        }
                        verificationTokenRepository.delete(existingToken);
                    });

            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = VerificationToken.builder()
                    .user(user)
                    .token(token)
                    .tokenType(TokenType.EMAIL_VERIFICATION)
                    .expiresAt(LocalDateTime.now().plusHours(24))
                    .build();
            verificationTokenRepository.save(verificationToken);

            emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), token);
        });
    }
}
