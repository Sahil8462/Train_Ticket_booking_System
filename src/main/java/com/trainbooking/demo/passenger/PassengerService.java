package com.trainbooking.demo.passenger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    public Passenger addPassenger(Passenger passenger){
        return passengerRepository.save(passenger);
    }

    public List<Passenger> getPassengersByBooking(Integer bookingId){
        return passengerRepository.findByBookingId(bookingId);
    }
}