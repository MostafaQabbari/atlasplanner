package com.atlasplanner.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private UUID id;
    private String country;
    private String city;
    private String startDate;
    private String endDate;
    private Integer matchScore;
    private LocalDateTime savedAt;
    private String planJson;
}
