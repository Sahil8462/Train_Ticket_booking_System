package com.trainbooking.demo.booking;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatSelectionService {

    private final SeatDraftStore seatDraftStore;

    public SeatSelectionService(SeatDraftStore seatDraftStore) {
        this.seatDraftStore = seatDraftStore;
    }

    public SeatSelectionResponseDto selectSeat(SeatSelectionRequestDto request) {

        seatDraftStore.saveSeats(request.getDraftId(), request.getSeatIds());

        SeatSelectionResponseDto response = new SeatSelectionResponseDto();
        response.setDraftId(request.getDraftId());
        response.setSeatIds(request.getSeatIds());
        response.setStatus("SELECTED");
        response.setMessage("Seats selected successfully");

        return response;
    }

    public List<Integer> getSelectedSeats(String draftId) {
        return seatDraftStore.getSeats(draftId);
    }
}