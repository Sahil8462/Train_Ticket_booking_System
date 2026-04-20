package com.trainbooking.demo.booking;

import com.trainbooking.demo.passenger.Passenger;
import com.trainbooking.demo.passenger.PassengerRepository;
import com.trainbooking.demo.search.SelectedTrainRequestDto;
import com.trainbooking.demo.ticket.Ticket;
import com.trainbooking.demo.ticket.TicketRepository;
import com.trainbooking.demo.train.Train;
import com.trainbooking.demo.train.TrainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FinalBookingService {

    private final BookingDraftStore bookingDraftStore;
    private final BookingDraftService bookingDraftService;
    private final SeatDraftStore seatDraftStore;
    private final BookingRepository bookingRepository;
    private final TrainRepository trainRepository;
    private final PassengerRepository passengerRepository;
    private final TicketRepository ticketRepository;

    public FinalBookingService(BookingDraftStore bookingDraftStore,
                               BookingDraftService bookingDraftService,
                               SeatDraftStore seatDraftStore,
                               BookingRepository bookingRepository,
                               TrainRepository trainRepository,
                               PassengerRepository passengerRepository,
                               TicketRepository ticketRepository) {
        this.bookingDraftStore = bookingDraftStore;
        this.bookingDraftService = bookingDraftService;
        this.seatDraftStore = seatDraftStore;
        this.bookingRepository = bookingRepository;
        this.trainRepository = trainRepository;
        this.passengerRepository = passengerRepository;
        this.ticketRepository = ticketRepository;
    }

    public FinalizeBookingResponseDto finalizeBooking(FinalizeBookingRequestDto request) {
        String draftId = request.getDraftId();

        SelectedTrainRequestDto selectedTrain = bookingDraftStore.getDraft(draftId);
        List<PassengerDetailsRequestDto> passengers = bookingDraftService.getPassengers(draftId);
        List<Integer> seatIds = seatDraftStore.getSeats(draftId);

        FinalizeBookingResponseDto response = new FinalizeBookingResponseDto();

        if (selectedTrain == null) {
            response.setStatus("FAILED");
            response.setMessage("Selected train not found for this draft.");
            return response;
        }

        if (passengers == null || passengers.isEmpty()) {
            response.setStatus("FAILED");
            response.setMessage("No passengers found for this draft.");
            return response;
        }

        if (seatIds == null || seatIds.isEmpty()) {
            response.setStatus("FAILED");
            response.setMessage("No seats selected for this draft.");
            return response;
        }

        if (passengers.size() != seatIds.size()) {
            response.setStatus("FAILED");
            response.setMessage("Selected seats count and passenger count must be same.");
            return response;
        }

        Optional<Train> trainOptional = trainRepository.findByTrainNumber(selectedTrain.getTrainNumber());

        if (trainOptional.isEmpty()) {
            response.setStatus("FAILED");
            response.setMessage("Train not found in internal database.");
            return response;
        }

        Train train = trainOptional.get();

        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setTrainId(train.getTrainId());

        // Compatibility ke liye booking table me first seat save kar rahe hain
        booking.setSeatId(seatIds.get(0));

        // Journey date save karna zaroori hai for seat_availability update after payment
        booking.setJourneyDate(LocalDate.parse(selectedTrain.getJourneyDate()));

        booking.setStatus("PENDING_PAYMENT");
        booking.setPnrNumber("PNR" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setBookingDate(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        for (int i = 0; i < passengers.size(); i++) {
            PassengerDetailsRequestDto p = passengers.get(i);
            Integer assignedSeatId = seatIds.get(i);

            Passenger passenger = new Passenger();
            passenger.setBookingId(savedBooking.getBookingId());
            passenger.setPassengerName(p.getPassengerName());
            passenger.setAge(p.getAge());
            passenger.setGender(p.getGender());
            passenger.setSeatId(assignedSeatId);

            // Abhi temporary hardcoded, next step me actual coach fetch karenge
            passenger.setCoachNumber("S1");

            passenger.setSeatStatus("PENDING_PAYMENT");
            passenger.setCreatedAt(LocalDateTime.now());

            passengerRepository.save(passenger);
        }

        Ticket ticket = new Ticket();
        ticket.setBookingId(savedBooking.getBookingId());
        ticket.setPnrNumber(savedBooking.getPnrNumber());
        ticket.setTicketStatus("PENDING_PAYMENT");
        ticket.setCreatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        response.setBookingId(savedBooking.getBookingId());
        response.setPnrNumber(savedBooking.getPnrNumber());
        response.setStatus("PENDING_PAYMENT");
        response.setMessage("Booking created successfully. Payment is pending.");

        return response;
    }
}