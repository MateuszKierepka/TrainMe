package com.trainme.repositories;

import com.trainme.entities.User;
import com.trainme.entities.VerificationToken;
import com.trainme.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUserAndTokenType(User user, TokenType tokenType);

    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.user = :user AND vt.tokenType = :tokenType")
    void deleteByUserAndTokenType(@Param("user") User user, @Param("tokenType") TokenType tokenType);

    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.user IN :users")
    void deleteByUserIn(@Param("users") List<User> users);

    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.expiresAt < :now")
    int deleteAllExpiredBefore(LocalDateTime now);
}
