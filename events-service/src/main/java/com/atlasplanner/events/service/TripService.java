package com.atlasplanner.events.service;

import com.atlasplanner.events.dto.SaveTripRequest;
import com.atlasplanner.events.dto.TripResponse;
import com.atlasplanner.events.model.SavedTrip;
import com.atlasplanner.events.repository.SavedTripRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final SavedTripRepository tripRepository;
    private final ObjectMapper objectMapper;

    public TripResponse saveTrip(UUID userId, SaveTripRequest request) {
        String customizationsJson = null;
        if (request.getCustomizations() != null && !request.getCustomizations().isEmpty()) {
            try {
                customizationsJson = objectMapper.writeValueAsString(request.getCustomizations());
            } catch (Exception e) {
                customizationsJson = "[]";
            }
        }

        SavedTrip trip = SavedTrip.builder()
                .userId(userId)
                .country(request.getCountry())
                .city(request.getCity())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .planJson(request.getPlanJson())
                .matchScore(request.getMatchScore())
                .nationality(request.getNationality())
                .customizationsJson(customizationsJson)
                .build();
        tripRepository.save(trip);
        return toResponse(trip);
    }

    public List<TripResponse> getUserTrips(UUID userId) {
        return tripRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TripResponse toResponse(SavedTrip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .country(trip.getCountry())
                .city(trip.getCity())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .matchScore(trip.getMatchScore())
                .savedAt(trip.getSavedAt())
                .planJson(trip.getPlanJson())
                .build();
    }
}
