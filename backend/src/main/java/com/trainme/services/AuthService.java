package com.trainme.services;

import com.trainme.dtos.AuthResponse;
import com.trainme.dtos.ForgotPasswordRequest;
import com.trainme.dtos.LoginRequest;
import com.trainme.dtos.RegisterRequest;
import com.trainme.dtos.ResetPasswordRequest;
import com.trainme.entities.TrainerProfile;
import com.trainme.entities.User;
import com.trainme.entities.VerificationToken;
import com.trainme.enums.TokenType;
import com.trainme.enums.UserRole;
import com.trainme.exceptions.EmailAlreadyExistsException;
import com.trainme.exceptions.InvalidTokenException;
import com.trainme.exceptions.PhoneAlreadyExistsException;
import com.trainme.mappers.UserMapper;
import com.trainme.repositories.TrainerProfileRepository;
import com.trainme.repositories.UserRepository;
import com.trainme.repositories.VerificationTokenRepository;
import com.trainme.security.CustomUserDetails;
import com.trainme.security.JwtService;
import com.trainme.security.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TrainerProfileRepository trainerProfileRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final EmailService emailService;
    private final UserMapper userMapper;

    @Transactional
    public void register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Hasła nie są identyczne");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException();
        }

        if (userRepository.existsByPhoneNumber(request.phoneNumber())) {
            throw new PhoneAlreadyExistsException();
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phoneNumber(request.phoneNumber())
                .dateOfBirth(request.dateOfBirth())
                .role(request.role())
                .build();

        userRepository.save(user);

        if (request.role() == UserRole.TRAINER) {
            TrainerProfile profile = TrainerProfile.builder()
                    .user(user)
                    .build();
            trainerProfileRepository.save(profile);
        }

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .user(user)
                .token(token)
                .tokenType(TokenType.EMAIL_VERIFICATION)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.user();

        String token = jwtService.generateToken(userDetails, Map.of(
                "role", user.getRole().name()
        ));

        cookieService.addAuthCookie(response, token);

        return userMapper.toAuthResponse(user);
    }

    public void logout(HttpServletResponse response) {
        cookieService.clearAuthCookie(response);
    }

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
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono użytkownika"));

        if (user.isVerified()) {
            throw new IllegalArgumentException("Konto jest już zweryfikowane");
        }

        verificationTokenRepository.deleteByUserAndTokenType(user, TokenType.EMAIL_VERIFICATION);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .user(user)
                .token(token)
                .tokenType(TokenType.EMAIL_VERIFICATION)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
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

            emailService.sendPasswordResetEmail(user.getEmail(), token);
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

    public AuthResponse getCurrentUser(CustomUserDetails userDetails) {
        return userMapper.toAuthResponse(userDetails.user());
    }
}
