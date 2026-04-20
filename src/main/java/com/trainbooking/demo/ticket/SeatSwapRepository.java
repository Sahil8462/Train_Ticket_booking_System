package com.trainbooking.demo.ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeatSwapRepository extends JpaRepository<SeatSwap, Integer> {

    List<SeatSwap> findByRequesterBookingId(Integer requesterBookingId);

    Optional<SeatSwap> findByRequestToken(String requestToken);
}