package com.trainbooking.demo.seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
private SeatAvailabilityRepository seatAvailabilityRepository;

    public List<Seat> getSeatsByTrain(Integer trainId) {
        return seatRepository.findByTrainId(trainId);
    }

    public Seat addSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<String> getCoachesByTrainId(Integer trainId) {
        return seatRepository.findDistinctCoachesByTrainId(trainId);
    }

    public List<Seat> getSeatsByTrainAndCoach(Integer trainId, String coachNumber) {
    return seatRepository.findByTrainIdAndCoachNumberOrderBySeatNumber(trainId, coachNumber);
}

public List<Seat> getSeatsByTrainCoachAndDate(Integer trainId, String coachNumber, String journeyDate) {
    List<Seat> seats = seatRepository.findByTrainIdAndCoachNumberOrderBySeatNumber(trainId, coachNumber);

    java.time.LocalDate date = java.time.LocalDate.parse(journeyDate);

    for (Seat seat : seats) {
        seatAvailabilityRepository
                .findBySeatIdAndJourneyDate(seat.getSeatId(), date)
                .ifPresent(availability -> seat.setStatus(availability.getStatus()));
    }

    return seats;
}
}