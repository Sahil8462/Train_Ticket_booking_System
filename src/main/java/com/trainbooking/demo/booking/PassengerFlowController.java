package com.trainbooking.demo.booking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passenger")
public class PassengerFlowController {

    private final BookingDraftService bookingDraftService;

    public PassengerFlowController(BookingDraftService bookingDraftService) {
        this.bookingDraftService = bookingDraftService;
    }

    @PostMapping("/add")
    public PassengerDetailsResponseDto addPassenger(@RequestBody PassengerDetailsRequestDto request) {
        bookingDraftService.addPassenger(request.getDraftId(), request);

        PassengerDetailsResponseDto response = new PassengerDetailsResponseDto();
        response.setDraftId(request.getDraftId());
        response.setPassengerName(request.getPassengerName());
        response.setAge(request.getAge());
        response.setGender(request.getGender());
        response.setStatus("ADDED");
        response.setMessage("Passenger added successfully.");

        return response;
    }

    @GetMapping("/list")
    public List<PassengerDetailsRequestDto> getPassengers(@RequestParam String draftId) {
        return bookingDraftService.getPassengers(draftId);
    }
}