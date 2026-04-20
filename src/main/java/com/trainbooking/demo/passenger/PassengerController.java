package com.trainbooking.demo.passenger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @PostMapping
    public Passenger addPassenger(@RequestBody Passenger passenger){
        return passengerService.addPassenger(passenger);
    }

    @GetMapping("/{bookingId}")
    public List<Passenger> getPassengers(@PathVariable Integer bookingId){
        return passengerService.getPassengersByBooking(bookingId);
    }
}