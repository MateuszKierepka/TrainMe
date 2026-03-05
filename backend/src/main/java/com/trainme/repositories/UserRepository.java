package com.trainme.repositories;

import com.trainme.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<User> findByEmailAndVerifiedFalse(String email);

    @Query("SELECT u FROM User u WHERE u.verified = false AND u.createdAt < :cutoff")
    List<User> findUnverifiedUsersCreatedBefore(LocalDateTime cutoff);

    @Modifying
    @Query("DELETE FROM User u WHERE u IN :users")
    void deleteAllInBulk(@Param("users") List<User> users);
}
