package com.trainbooking.demo.ticket;

public class SeatSwapResponseDto {

    private Integer swapId;
    private String status;
    private String message;

    public Integer getSwapId() {
        return swapId;
    }

    public void setSwapId(Integer swapId) {
        this.swapId = swapId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}