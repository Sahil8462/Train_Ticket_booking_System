package com.trainbooking.demo.ticket;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    Optional<Ticket> findByPnrNumber(String pnrNumber);

    Optional<Ticket> findByBookingId(Integer bookingId);
}