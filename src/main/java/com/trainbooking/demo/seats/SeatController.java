package com.trainbooking.demo.seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

     @GetMapping("/coaches/{trainId}")
    public List<String> getCoaches(@PathVariable Integer trainId) {
        return seatService.getCoachesByTrainId(trainId);
    }

    @GetMapping("/{trainId}/{coachNumber}")
public List<Seat> getSeatsByCoach(@PathVariable Integer trainId, @PathVariable String coachNumber) {
    return seatService.getSeatsByTrainAndCoach(trainId, coachNumber);
}

@GetMapping("/{trainId}/{coachNumber}/by-date")
public List<Seat> getSeatsByDate(
        @PathVariable Integer trainId,
        @PathVariable String coachNumber,
        @RequestParam String date) {

    return seatService.getSeatsByTrainCoachAndDate(trainId, coachNumber, date);
}

    @GetMapping("/{trainId}")
    public List<Seat> getSeats(@PathVariable Integer trainId) {
        return seatService.getSeatsByTrain(trainId);
    }

    @PostMapping
    public Seat addSeat(@RequestBody Seat seat) {
        return seatService.addSeat(seat);
    }
}