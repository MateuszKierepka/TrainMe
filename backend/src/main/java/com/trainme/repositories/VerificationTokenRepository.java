package com.trainme.repositories;

import com.trainme.entities.User;
import com.trainme.entities.VerificationToken;
import com.trainme.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByToken(String token);
    void deleteByUserAndTokenType(User user, TokenType tokenType);
    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.expiresAt < :now")
    int deleteAllExpiredBefore(LocalDateTime now);
}
