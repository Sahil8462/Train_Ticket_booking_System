package com.trainbooking.demo.ticket;

import com.trainbooking.demo.booking.Booking;
import com.trainbooking.demo.booking.BookingRepository;
import com.trainbooking.demo.passenger.Passenger;
import com.trainbooking.demo.passenger.PassengerRepository;
import com.trainbooking.demo.seats.Seat;
import com.trainbooking.demo.seats.SeatAvailability;
import com.trainbooking.demo.seats.SeatAvailabilityRepository;
import com.trainbooking.demo.seats.SeatRepository;
import com.trainbooking.demo.train.Train;
import com.trainbooking.demo.train.TrainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final TrainRepository trainRepository;
    private final SeatRepository seatRepository;
    private final SeatAvailabilityRepository seatAvailabilityRepository;

    public TicketService(TicketRepository ticketRepository,
                         BookingRepository bookingRepository,
                         PassengerRepository passengerRepository,
                         TrainRepository trainRepository,
                         SeatRepository seatRepository,
                         SeatAvailabilityRepository seatAvailabilityRepository) {
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.trainRepository = trainRepository;
        this.seatRepository = seatRepository;
        this.seatAvailabilityRepository = seatAvailabilityRepository;
    }

    public TicketResponseDto getTicketByPnr(String pnrNumber) {
        Optional<Ticket> ticketOptional = ticketRepository.findByPnrNumber(pnrNumber);

        if (ticketOptional.isEmpty()) {
            return null;
        }

        Ticket ticket = ticketOptional.get();

        Optional<Booking> bookingOptional = bookingRepository.findById(ticket.getBookingId());
        if (bookingOptional.isEmpty()) {
            return null;
        }

        Booking booking = bookingOptional.get();

        Optional<Train> trainOptional = trainRepository.findById(booking.getTrainId());
        if (trainOptional.isEmpty()) {
            return null;
        }

        Train train = trainOptional.get();

        List<Passenger> passengerList = passengerRepository.findByBookingId(booking.getBookingId());

        TicketResponseDto response = new TicketResponseDto();
        response.setPnrNumber(ticket.getPnrNumber());
        response.setTrainName(train.getTrainName());
        response.setSource(train.getSourceStation());
        response.setDestination(train.getDestinationStation());
        response.setStatus(ticket.getTicketStatus());

        List<TicketResponseDto.PassengerInfo> passengerInfoList = new ArrayList<>();

        for (Passenger p : passengerList) {
            TicketResponseDto.PassengerInfo info = new TicketResponseDto.PassengerInfo();
            info.setName(p.getPassengerName());
            info.setAge(p.getAge());
            info.setGender(p.getGender());
            info.setSeatId(p.getSeatId());

            passengerInfoList.add(info);
        }

        response.setPassengers(passengerInfoList);

        return response;
    }

    public SwapTicketLookupResponseDto getSwapTicketByPnr(String pnrNumber) {
        Optional<Ticket> ticketOptional = ticketRepository.findByPnrNumber(pnrNumber);

        if (ticketOptional.isEmpty()) {
            return null;
        }

        Ticket ticket = ticketOptional.get();

        Optional<Booking> bookingOptional = bookingRepository.findById(ticket.getBookingId());
        if (bookingOptional.isEmpty()) {
            return null;
        }

        Booking booking = bookingOptional.get();

        Optional<Train> trainOptional = trainRepository.findById(booking.getTrainId());
        if (trainOptional.isEmpty()) {
            return null;
        }

        Train train = trainOptional.get();

        List<Passenger> passengerList = passengerRepository.findByBookingId(booking.getBookingId());

        SwapTicketLookupResponseDto response = new SwapTicketLookupResponseDto();
        response.setBookingId(booking.getBookingId());
        response.setTrainId(train.getTrainId());
        response.setPnrNumber(ticket.getPnrNumber());
        response.setTrainName(train.getTrainName());
        response.setSource(train.getSourceStation());
        response.setDestination(train.getDestinationStation());
        response.setJourneyDate(booking.getJourneyDate());
        response.setStatus(ticket.getTicketStatus());

        List<SwapTicketLookupResponseDto.PassengerSwapInfo> passengerInfoList = new ArrayList<>();

        for (Passenger p : passengerList) {
            SwapTicketLookupResponseDto.PassengerSwapInfo info =
                    new SwapTicketLookupResponseDto.PassengerSwapInfo();

            info.setPassengerId(p.getPassengerId());
            info.setName(p.getPassengerName());
            info.setAge(p.getAge());
            info.setGender(p.getGender());
            info.setSeatId(p.getSeatId());
            info.setSeatStatus(p.getSeatStatus());
            info.setCoachNumber(p.getCoachNumber());

            if (p.getSeatId() != null) {
                seatRepository.findById(p.getSeatId()).ifPresent(seat -> {
                    info.setSeatNumber(seat.getSeatNumber());
                    info.setSeatType(seat.getSeatType());

                    if (info.getCoachNumber() == null || info.getCoachNumber().isBlank()) {
                        info.setCoachNumber(seat.getCoachNumber());
                    }
                });
            }

            passengerInfoList.add(info);
        }

        response.setPassengers(passengerInfoList);

        return response;
    }

    public List<SwapSeatOptionDto> getSwapSeatOptions(Integer trainId, LocalDate journeyDate) {

        List<SeatAvailability> availabilityList =
                seatAvailabilityRepository.findByTrainIdAndJourneyDate(trainId, journeyDate);

        List<SwapSeatOptionDto> response = new ArrayList<>();

        for (SeatAvailability availability : availabilityList) {
            seatRepository.findById(availability.getSeatId()).ifPresent(seat -> {
                SwapSeatOptionDto dto = new SwapSeatOptionDto();
                dto.setSeatId(seat.getSeatId());
                dto.setCoachNumber(seat.getCoachNumber());
                dto.setSeatNumber(seat.getSeatNumber());
                dto.setSeatType(seat.getSeatType());
                dto.setStatus(availability.getStatus());
                response.add(dto);
            });
        }

        return response;
    }
}