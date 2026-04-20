package com.trainbooking.demo.booking;

import com.trainbooking.demo.seats.Seat;
import com.trainbooking.demo.seats.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    public Booking bookSeat(Integer userId, Integer trainId, Integer seatId) {

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
            throw new RuntimeException("Seat already booked");
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setTrainId(trainId);
        booking.setSeatId(seatId);
        booking.setStatus("PENDING_PAYMENT");
        booking.setPnrNumber(UUID.randomUUID().toString().substring(0, 10));
        booking.setBookingDate(LocalDateTime.now());

        return bookingRepository.save(booking);
    }
}