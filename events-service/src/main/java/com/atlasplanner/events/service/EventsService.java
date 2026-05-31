package com.atlasplanner.events.service;

import com.atlasplanner.events.model.Event;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventsService {

    @Value("${ticketmaster.api.key}")
    private String ticketmasterApiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://app.ticketmaster.com/discovery/v2")
            .build();

    public List<Event> getEventsByCountryAndDates(
            String countryCode,
            String startDate,
            String endDate
    ) {
        try {
            Map response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/events.json")
                            .queryParam("apikey", ticketmasterApiKey)
                            .queryParam("countryCode", countryCode)
                            .queryParam("startDateTime", startDate + "T00:00:00Z")
                            .queryParam("endDateTime", endDate + "T23:59:59Z")
                            .queryParam("size", 10)
                            .queryParam("sort", "date,asc")
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return parseTicketmasterResponse(response);

        } catch (Exception e) {
            // Return empty list if API fails — don't break the plan generation
            return new ArrayList<>();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Event> parseTicketmasterResponse(Map response) {
        List<Event> events = new ArrayList<>();
        if (response == null) return events;

        try {
            Map embedded = (Map) response.get("_embedded");
            if (embedded == null) return events;

            List<Map> rawEvents = (List<Map>) embedded.get("events");
            if (rawEvents == null) return events;

            for (Map raw : rawEvents) {
                Map dates = (Map) raw.get("dates");
                Map start = dates != null ? (Map) dates.get("start") : null;

                List<Map> images = (List<Map>) raw.get("images");
                String imageUrl = images != null && !images.isEmpty()
                        ? (String) images.get(0).get("url") : null;

                Map embedded2 = (Map) raw.get("_embedded");
                List<Map> venues = embedded2 != null ? (List<Map>) embedded2.get("venues") : null;
                String venue = venues != null && !venues.isEmpty()
                        ? (String) venues.get(0).get("name") : "TBA";
                String city = venues != null && !venues.isEmpty()
                        ? (String) ((Map) venues.get(0).get("city")).get("name") : "";

                Event event = Event.builder()
                        .id((String) raw.get("id"))
                        .name((String) raw.get("name"))
                        .date(start != null ? (String) start.get("localDate") : "")
                        .time(start != null ? (String) start.get("localTime") : "")
                        .venue(venue)
                        .city(city)
                        .imageUrl(imageUrl)
                        .ticketUrl((String) raw.get("url"))
                        .source("ticketmaster")
                        .build();

                events.add(event);
            }
        } catch (Exception ignored) {}

        return events;
    }
}
