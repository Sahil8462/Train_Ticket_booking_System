package com.trainbooking.demo.booking;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookingDraftService {

    private final Map<String, List<PassengerDetailsRequestDto>> draftPassengers = new HashMap<>();

    public void addPassenger(String draftId, PassengerDetailsRequestDto passenger) {
        draftPassengers
                .computeIfAbsent(draftId, k -> new ArrayList<>())
                .add(passenger);
    }

    public List<PassengerDetailsRequestDto> getPassengers(String draftId) {
        return draftPassengers.getOrDefault(draftId, new ArrayList<>());
    }
}