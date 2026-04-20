package com.trainbooking.demo.seats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {

    List<Seat> findByTrainId(Integer trainId);

     @Query("SELECT DISTINCT s.coachNumber FROM Seat s WHERE s.trainId = :trainId ORDER BY s.coachNumber")
    List<String> findDistinctCoachesByTrainId(@Param("trainId") Integer trainId);

    List<Seat> findByTrainIdAndCoachNumberOrderBySeatNumber(Integer trainId, String coachNumber);

}