package com.trainbooking.demo.booking;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SeatDraftStore {

    private final Map<String, List<Integer>> selectedSeats = new ConcurrentHashMap<>();

    public void saveSeats(String draftId, List<Integer> seatIds) {
        selectedSeats.put(draftId, seatIds);
    }

    public List<Integer> getSeats(String draftId) {
        return selectedSeats.get(draftId);
    }
}