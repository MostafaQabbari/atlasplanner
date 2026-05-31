package com.atlasplanner.events.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    private String id;
    private String name;
    private String date;
    private String time;
    private String venue;
    private String city;
    private String country;
    private String category;     // music, sports, arts, comedy, etc.
    private String imageUrl;
    private String ticketUrl;
    private Double priceMin;
    private Double priceMax;
    private String source;       // ticketmaster, eventbrite
}
