package com.trainbooking.demo.passenger;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {

    List<Passenger> findByBookingId(Integer bookingId);

    @Query("""
        SELECT p
        FROM Passenger p, Booking b
        WHERE p.bookingId = b.bookingId
          AND p.seatId = :seatId
          AND b.trainId = :trainId
          AND b.journeyDate = :journeyDate
          AND b.status = 'CONFIRMED'
        """)
    List<Passenger> findConfirmedPassengersBySeatIdAndJourney(
            Integer seatId,
            Integer trainId,
            LocalDate journeyDate
    );
}