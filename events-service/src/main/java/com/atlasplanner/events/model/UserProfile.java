package com.atlasplanner.events.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    private String travelerType;
    private String pace;
    private String budgetStyle;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(length = 100)
    private String nationality;

    private String accommodation;
    private String languageComfort;
    private String scenery;
    private String safetyPriority;
    private String duration;
}
