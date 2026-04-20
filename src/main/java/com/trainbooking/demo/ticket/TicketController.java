package com.trainbooking.demo.ticket;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/pnr/{pnrNumber}")
    public TicketResponseDto getTicketByPnr(@PathVariable String pnrNumber) {
        return ticketService.getTicketByPnr(pnrNumber);
    }

    @GetMapping("/swap/pnr/{pnrNumber}")
    public SwapTicketLookupResponseDto getSwapTicketByPnr(@PathVariable String pnrNumber) {
        return ticketService.getSwapTicketByPnr(pnrNumber);
    }

     @GetMapping("/swap/seats")
    public List<SwapSeatOptionDto> getSwapSeatOptions(
            @RequestParam Integer trainId,
            @RequestParam String journeyDate
    ) {
        return ticketService.getSwapSeatOptions(trainId, LocalDate.parse(journeyDate));
    }
}