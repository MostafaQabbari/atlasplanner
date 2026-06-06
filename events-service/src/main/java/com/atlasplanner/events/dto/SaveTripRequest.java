package com.atlasplanner.events.dto;

import lombok.Data;

import java.util.List;

@Data
public class SaveTripRequest {
    private String country;
    private String city;
    private String startDate;
    private String endDate;
    private String planJson;
    private Integer matchScore;
    private String nationality;
    private List<String> customizations;
}
