package com.trainme.repositories;

import com.trainme.entities.TrainerProfile;
import com.trainme.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, UUID> {

    @Modifying
    @Query("DELETE FROM TrainerProfile tp WHERE tp.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM TrainerProfile tp WHERE tp.user IN :users")
    void deleteByUserIn(@Param("users") List<User> users);
}
