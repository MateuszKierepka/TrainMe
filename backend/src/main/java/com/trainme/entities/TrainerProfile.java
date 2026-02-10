package com.trainme.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "trainer_profiles")
@NoArgsConstructor @AllArgsConstructor @Getter @Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TrainerProfile {

    @Id
    @EqualsAndHashCode.Include
    private UUID trainerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String bio;

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "price_per_training")
    private BigDecimal pricePerTraining;

    @Builder.Default
    @Column(name = "training_duration_minutes", nullable = false)
    private int trainingDurationMinutes = 60;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = false;

    @Builder.Default
    @Column(name = "average_rating")
    private BigDecimal averageRating = BigDecimal.ZERO;
}
