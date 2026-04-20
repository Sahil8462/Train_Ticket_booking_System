package com.trainbooking.demo.payment.dto;

public class PaymentFailedRequestDto {

    private Integer paymentId;
    private String failureReason;

    public PaymentFailedRequestDto() {
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
}