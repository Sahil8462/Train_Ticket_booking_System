package com.trainbooking.demo.booking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seat")
public class SeatFlowController {

    private final SeatSelectionService seatSelectionService;

    public SeatFlowController(SeatSelectionService seatSelectionService) {
        this.seatSelectionService = seatSelectionService;
    }

    @PostMapping("/select")
    public SeatSelectionResponseDto selectSeat(@RequestBody SeatSelectionRequestDto request) {
        return seatSelectionService.selectSeat(request);
    }

    @GetMapping("/view")
    public List<Integer> getSelectedSeats(@RequestParam String draftId) {
        return seatSelectionService.getSelectedSeats(draftId);
    }
}