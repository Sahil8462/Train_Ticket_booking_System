package com.trainbooking.demo.ticket;

public class CreateSeatSwapRequestDto {

    private Integer requesterBookingId;
    private Integer requesterPassengerId;
    private Integer requesterCurrentSeatId;
    private Integer targetSeatId;

    public Integer getRequesterBookingId() {
        return requesterBookingId;
    }

    public void setRequesterBookingId(Integer requesterBookingId) {
        this.requesterBookingId = requesterBookingId;
    }

    public Integer getRequesterPassengerId() {
        return requesterPassengerId;
    }

    public void setRequesterPassengerId(Integer requesterPassengerId) {
        this.requesterPassengerId = requesterPassengerId;
    }

    public Integer getRequesterCurrentSeatId() {
        return requesterCurrentSeatId;
    }

    public void setRequesterCurrentSeatId(Integer requesterCurrentSeatId) {
        this.requesterCurrentSeatId = requesterCurrentSeatId;
    }

    public Integer getTargetSeatId() {
        return targetSeatId;
    }

    public void setTargetSeatId(Integer targetSeatId) {
        this.targetSeatId = targetSeatId;
    }
}