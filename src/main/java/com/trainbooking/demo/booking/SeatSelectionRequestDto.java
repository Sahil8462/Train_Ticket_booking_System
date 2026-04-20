package com.trainbooking.demo.booking;

import java.util.List;

public class SeatSelectionRequestDto {

    private String draftId;
    private List<Integer> seatIds;

    public SeatSelectionRequestDto() {
    }

    public String getDraftId() {
        return draftId;
    }

    public void setDraftId(String draftId) {
        this.draftId = draftId;
    }

    public List<Integer> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Integer> seatIds) {
        this.seatIds = seatIds;
    }
}