package com.trainbooking.demo.ticket;

public class SwapPaymentSuccessDto {

    private Integer swapId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    public Integer getSwapId() {
        return swapId;
    }

    public void setSwapId(Integer swapId) {
        this.swapId = swapId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}