package com.atlasplanner.events.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    private String country;
    private String city;
    private String startDate;
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String planJson;

    private Integer matchScore;

    @Column(length = 100)
    private String nationality;

    @Column(columnDefinition = "TEXT")
    private String customizationsJson;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }
}
