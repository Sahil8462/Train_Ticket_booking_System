package com.trainbooking.demo.ticket;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_swaps")
public class SeatSwap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "swap_id")
    private Integer swapId;

    @Column(name = "requester_booking_id")
    private Integer requesterBookingId;

    @Column(name = "requester_passenger_id")
    private Integer requesterPassengerId;

    @Column(name = "requester_current_seat_id")
    private Integer requesterCurrentSeatId;

    @Column(name = "target_seat_id")
    private Integer targetSeatId;

    @Column(name = "target_passenger_id")
    private Integer targetPassengerId;

    @Column(name = "swap_type")
    private String swapType;

    @Column(name = "status")
    private String status;

    @Column(name = "swap_charge")
    private java.math.BigDecimal swapCharge;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "request_token")
    private String requestToken;

    @Column(name = "expiry_time")
    private LocalDateTime expiryTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Integer getSwapId() {
        return swapId;
    }

    public void setSwapId(Integer swapId) {
        this.swapId = swapId;
    }

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

    public Integer getTargetPassengerId() {
        return targetPassengerId;
    }

    public void setTargetPassengerId(Integer targetPassengerId) {
        this.targetPassengerId = targetPassengerId;
    }

    public String getSwapType() {
        return swapType;
    }

    public void setSwapType(String swapType) {
        this.swapType = swapType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public java.math.BigDecimal getSwapCharge() {
        return swapCharge;
    }

    public void setSwapCharge(java.math.BigDecimal swapCharge) {
        this.swapCharge = swapCharge;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getRequestToken() {
        return requestToken;
    }

    public void setRequestToken(String requestToken) {
        this.requestToken = requestToken;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}