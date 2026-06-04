package com.atlasplanner.events.repository;

import com.atlasplanner.events.model.SavedTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavedTripRepository extends JpaRepository<SavedTrip, UUID> {
    List<SavedTrip> findByUserIdOrderBySavedAtDesc(UUID userId);
}
