package com.trainbooking.demo.seats;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SeatAvailabilityRepository extends JpaRepository<SeatAvailability, Integer> {

    List<SeatAvailability> findByTrainIdAndJourneyDate(Integer trainId, LocalDate journeyDate);

    Optional<SeatAvailability> findBySeatIdAndJourneyDate(Integer seatId, LocalDate journeyDate);
}