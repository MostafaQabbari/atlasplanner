package com.atlasplanner.events.dto;

import lombok.Data;

@Data
public class SaveTripRequest {
    private String country;
    private String city;
    private String startDate;
    private String endDate;
    private String planJson;
    private Integer matchScore;
}
