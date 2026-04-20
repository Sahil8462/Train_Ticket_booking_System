package com.trainbooking.demo.payment.controller;

import com.trainbooking.demo.payment.dto.CreateRazorpayOrderRequestDto;
import com.trainbooking.demo.payment.dto.PaymentFailedRequestDto;
import com.trainbooking.demo.payment.dto.PaymentResponseDto;
import com.trainbooking.demo.payment.dto.RazorpayVerifyRequestDto;
import com.trainbooking.demo.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public PaymentResponseDto createRazorpayOrder(@RequestBody CreateRazorpayOrderRequestDto requestDto) throws Exception {
        return paymentService.createRazorpayOrder(requestDto);
    }

    @PostMapping("/verify")
    public PaymentResponseDto verifyRazorpayPayment(@RequestBody RazorpayVerifyRequestDto requestDto) throws Exception {
        return paymentService.verifyRazorpayPayment(requestDto);
    }

    @GetMapping("/booking/{bookingId}")
    public PaymentResponseDto getLatestPaymentByBookingId(@PathVariable Integer bookingId) {
        return paymentService.getLatestPaymentByBookingId(bookingId);
    }

    @PutMapping("/failed")
    public PaymentResponseDto markPaymentFailed(@RequestBody PaymentFailedRequestDto requestDto) {
        return paymentService.markPaymentFailed(
                requestDto.getPaymentId(),
                requestDto.getFailureReason()
        );
    }

    @GetMapping("/test")
    public String testPaymentApi() {
        return "Payment API is working";
    }
}