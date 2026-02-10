package com.trainme.repositories;

import com.trainme.entities.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, UUID> {
}
