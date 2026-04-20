package com.trainbooking.demo.booking;

public class FinalizeBookingRequestDto {

    private String draftId;
    private Integer userId;

    public FinalizeBookingRequestDto() {
    }

    public String getDraftId() {
        return draftId;
    }

    public void setDraftId(String draftId) {
        this.draftId = draftId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}