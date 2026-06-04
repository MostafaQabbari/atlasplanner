package com.atlasplanner.events.controller;

import com.atlasplanner.events.dto.SaveTripRequest;
import com.atlasplanner.events.dto.TripResponse;
import com.atlasplanner.events.service.JwtService;
import com.atlasplanner.events.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final JwtService jwtService;

    @PostMapping("/save")
    public ResponseEntity<TripResponse> saveTrip(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SaveTripRequest request) {
        UUID userId = extractUserId(authHeader);
        return ResponseEntity.ok(tripService.saveTrip(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getTrips(
            @RequestHeader("Authorization") String authHeader) {
        UUID userId = extractUserId(authHeader);
        return ResponseEntity.ok(tripService.getUserTrips(userId));
    }

    private UUID extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtService.extractUserId(token);
    }
}
