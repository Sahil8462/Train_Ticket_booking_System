package com.trainbooking.demo.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
private FinalBookingService finalBookingService;

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking bookSeat(@RequestParam Integer userId,
                            @RequestParam Integer trainId,
                            @RequestParam Integer seatId) {

        return bookingService.bookSeat(userId, trainId, seatId);
    }

     @PostMapping("/finalize")
public FinalizeBookingResponseDto finalizeBooking(@RequestBody FinalizeBookingRequestDto request) {
    return finalBookingService.finalizeBooking(request);
}
}