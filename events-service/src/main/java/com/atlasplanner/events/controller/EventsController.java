package com.atlasplanner.events.controller;

import com.atlasplanner.events.model.Event;
import com.atlasplanner.events.service.EventsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventsController {

    private final EventsService eventsService;

    public EventsController(EventsService eventsService) {
        this.eventsService = eventsService;
    }

    /**
     * GET /api/events/{countryCode}?startDate=2025-08-01&endDate=2025-08-14
     * Returns events in a country within the travel date range.
     * countryCode: ISO 3166-1 alpha-2 (e.g. JP, DE, IT, TH)
     */
    @GetMapping("/{countryCode}")
    public List<Event> getEvents(
            @PathVariable String countryCode,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return eventsService.getEventsByCountryAndDates(
                countryCode.toUpperCase(),
                startDate,
                endDate
        );
    }

    @GetMapping("/health")
    public String health() {
        return "Events Service is running 🎭";
    }
}
