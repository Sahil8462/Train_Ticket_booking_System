package com.trainbooking.demo.ticket;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/seat-swaps")
public class SeatSwapController {

    private final SeatSwapService seatSwapService;

    public SeatSwapController(SeatSwapService seatSwapService) {
        this.seatSwapService = seatSwapService;
    }

    @PostMapping("/request")
    public SeatSwapResponseDto createSwapRequest(@RequestBody CreateSeatSwapRequestDto request) {
        return seatSwapService.createSwapRequest(request);
    }

    @PostMapping("/available/create-payment")
public Map<String, Object> createAvailableSeatSwapPayment(@RequestBody CreateSeatSwapRequestDto request) {
    return seatSwapService.createAvailableSeatSwapPaymentOrder(request);
}

    @PostMapping("/payment-success")
    public SeatSwapResponseDto completeAvailableSeatSwapPayment(@RequestBody CreateSeatSwapRequestDto request) {
        return seatSwapService.completeAvailableSeatSwapPayment(request);
    }

    @GetMapping("/respond")
    public String respondToSwapRequest(@RequestParam String token, @RequestParam String action) {
        return seatSwapService.respondToSwapRequest(token, action);
    }

    @PostMapping("/{swapId}/create-payment")
    public Map<String, Object> createPayment(@PathVariable Integer swapId) {
        return seatSwapService.createPaymentOrder(swapId);
    }

    @PostMapping("/payment-success/booked")
public SeatSwapResponseDto completeBookedSeatSwapPayment(@RequestBody SwapPaymentSuccessDto request) {
    return seatSwapService.completeBookedSeatSwapPayment(request);
}
}