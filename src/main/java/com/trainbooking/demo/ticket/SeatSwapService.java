package com.trainbooking.demo.ticket;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.trainbooking.demo.booking.Booking;
import com.trainbooking.demo.booking.BookingRepository;
import com.trainbooking.demo.model.User;
import com.trainbooking.demo.passenger.Passenger;
import com.trainbooking.demo.passenger.PassengerRepository;
import com.trainbooking.demo.repository.UserRepository;
import com.trainbooking.demo.seats.Seat;
import com.trainbooking.demo.seats.SeatAvailability;
import com.trainbooking.demo.seats.SeatAvailabilityRepository;
import com.trainbooking.demo.seats.SeatRepository;
import com.trainbooking.demo.service.EmailService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SeatSwapService {

    private final SeatSwapRepository seatSwapRepository;
    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final SeatRepository seatRepository;
    private final SeatAvailabilityRepository seatAvailabilityRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public SeatSwapService(SeatSwapRepository seatSwapRepository,
                           BookingRepository bookingRepository,
                           PassengerRepository passengerRepository,
                           SeatRepository seatRepository,
                           SeatAvailabilityRepository seatAvailabilityRepository,
                           UserRepository userRepository,
                           EmailService emailService) {
        this.seatSwapRepository = seatSwapRepository;
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.seatRepository = seatRepository;
        this.seatAvailabilityRepository = seatAvailabilityRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public SeatSwapResponseDto createSwapRequest(CreateSeatSwapRequestDto request) {
        Booking booking = bookingRepository.findById(request.getRequesterBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Passenger passenger = passengerRepository.findById(request.getRequesterPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        if (!booking.getBookingId().equals(passenger.getBookingId())) {
            throw new RuntimeException("Passenger does not belong to this booking");
        }

        if (request.getRequesterCurrentSeatId() == null || request.getTargetSeatId() == null) {
            throw new RuntimeException("Current seat and target seat are required");
        }

        if (request.getRequesterCurrentSeatId().equals(request.getTargetSeatId())) {
            throw new RuntimeException("Current seat and target seat cannot be same");
        }

        if (!request.getRequesterCurrentSeatId().equals(passenger.getSeatId())) {
            throw new RuntimeException("Current seat does not belong to selected passenger");
        }

        if (booking.getJourneyDate() == null) {
            throw new RuntimeException("Journey date not found for booking");
        }

        Seat currentSeat = seatRepository.findById(request.getRequesterCurrentSeatId())
                .orElseThrow(() -> new RuntimeException("Current seat not found"));

        Seat targetSeat = seatRepository.findById(request.getTargetSeatId())
                .orElseThrow(() -> new RuntimeException("Target seat not found"));

        if (!currentSeat.getTrainId().equals(targetSeat.getTrainId())) {
            throw new RuntimeException("Target seat must belong to same train");
        }

        String targetSeatStatus = targetSeat.getStatus();

        if (targetSeatStatus == null || targetSeatStatus.isBlank()) {
            throw new RuntimeException("Target seat status is invalid");
        }

        SeatSwapResponseDto response = new SeatSwapResponseDto();

        if ("AVAILABLE".equalsIgnoreCase(targetSeatStatus)) {
            response.setSwapId(null);
            response.setStatus("PAYMENT_PENDING");
            response.setMessage("Target seat is available. Proceed to payment.");
            return response;

        } else if ("BOOKED".equalsIgnoreCase(targetSeatStatus)) {
            List<Passenger> targetPassengers = passengerRepository.findConfirmedPassengersBySeatIdAndJourney(
                    request.getTargetSeatId(),
                    booking.getTrainId(),
                    booking.getJourneyDate()
            );

            if (targetPassengers.isEmpty()) {
                throw new RuntimeException("Target passenger not found for booked seat");
            }

            if (targetPassengers.size() > 1) {
                throw new RuntimeException("Multiple passengers found for target seat on this journey");
            }

            Passenger targetPassenger = targetPassengers.get(0);

            if (targetPassenger.getPassengerId().equals(request.getRequesterPassengerId())) {
                throw new RuntimeException("You cannot request swap with your own seat");
            }

            Booking targetBooking = bookingRepository.findById(targetPassenger.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Target booking not found"));

            User targetUser = userRepository.findById(targetBooking.getUserId())
                    .orElseThrow(() -> new RuntimeException("Target user not found"));

            String targetEmail = targetUser.getEmail();

            String rawToken = generateRawToken();
            String hashedToken = hashToken(rawToken);
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(30);

            String acceptUrl = "http://localhost:8080/api/seat-swaps/respond?token=" + rawToken + "&action=accept";
            String rejectUrl = "http://localhost:8080/api/seat-swaps/respond?token=" + rawToken + "&action=reject";

            String seatInfo = "Current Seat ID: " + request.getRequesterCurrentSeatId()
                    + ", Requested Seat ID: " + request.getTargetSeatId();

            emailService.sendSwapRequestEmail(
                    targetEmail,
                    passenger.getPassengerName(),
                    seatInfo,
                    acceptUrl,
                    rejectUrl
            );

            SeatSwap seatSwap = new SeatSwap();
            seatSwap.setRequesterBookingId(request.getRequesterBookingId());
            seatSwap.setRequesterPassengerId(request.getRequesterPassengerId());
            seatSwap.setRequesterCurrentSeatId(request.getRequesterCurrentSeatId());
            seatSwap.setTargetSeatId(request.getTargetSeatId());
            seatSwap.setTargetPassengerId(targetPassenger.getPassengerId());
            seatSwap.setSwapType("BOOKED");
            seatSwap.setStatus("EMAIL_SENT");
            seatSwap.setSwapCharge(new BigDecimal("100.00"));
            seatSwap.setPaymentStatus("PENDING");
            seatSwap.setRequestToken(hashedToken);
            seatSwap.setExpiryTime(expiryTime);
            seatSwap.setCreatedAt(LocalDateTime.now());

            SeatSwap savedSwap = seatSwapRepository.save(seatSwap);

            response.setSwapId(savedSwap.getSwapId());
            response.setStatus("EMAIL_SENT");
            response.setMessage("Swap request email sent successfully to: " + targetEmail);
            return response;

        } else {
            throw new RuntimeException("Target seat is not eligible for swap");
        }
    }

    public SeatSwapResponseDto completeAvailableSeatSwapPayment(CreateSeatSwapRequestDto request) {
        Booking booking = bookingRepository.findById(request.getRequesterBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Passenger passenger = passengerRepository.findById(request.getRequesterPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        if (!booking.getBookingId().equals(passenger.getBookingId())) {
            throw new RuntimeException("Passenger does not belong to this booking");
        }

        if (booking.getJourneyDate() == null) {
            throw new RuntimeException("Journey date not found for booking");
        }

        if (!request.getRequesterCurrentSeatId().equals(passenger.getSeatId())) {
            throw new RuntimeException("Current seat does not belong to selected passenger");
        }

        Seat currentSeat = seatRepository.findById(request.getRequesterCurrentSeatId())
                .orElseThrow(() -> new RuntimeException("Current seat not found"));

        Seat targetSeat = seatRepository.findById(request.getTargetSeatId())
                .orElseThrow(() -> new RuntimeException("Target seat not found"));

        if (!currentSeat.getTrainId().equals(targetSeat.getTrainId())) {
            throw new RuntimeException("Target seat must belong to same train");
        }

        if (!"AVAILABLE".equalsIgnoreCase(targetSeat.getStatus())) {
            throw new RuntimeException("Target seat is no longer available");
        }

        SeatAvailability currentAvailability = seatAvailabilityRepository
                .findBySeatIdAndJourneyDate(currentSeat.getSeatId(), booking.getJourneyDate())
                .orElseThrow(() -> new RuntimeException("Current seat availability not found"));

        SeatAvailability targetAvailability = seatAvailabilityRepository
                .findBySeatIdAndJourneyDate(targetSeat.getSeatId(), booking.getJourneyDate())
                .orElseThrow(() -> new RuntimeException("Target seat availability not found"));

        if (!"AVAILABLE".equalsIgnoreCase(targetAvailability.getStatus())) {
            throw new RuntimeException("Target seat is no longer available for this journey");
        }

        passenger.setSeatId(targetSeat.getSeatId());
        passenger.setCoachNumber(targetSeat.getCoachNumber());
        passenger.setSeatStatus("BOOKED");
        passengerRepository.save(passenger);

        currentSeat.setStatus("AVAILABLE");
        seatRepository.save(currentSeat);

        targetSeat.setStatus("BOOKED");
        seatRepository.save(targetSeat);

        currentAvailability.setStatus("AVAILABLE");
        seatAvailabilityRepository.save(currentAvailability);

        targetAvailability.setStatus("BOOKED");
        seatAvailabilityRepository.save(targetAvailability);

        SeatSwap seatSwap = new SeatSwap();
        seatSwap.setRequesterBookingId(request.getRequesterBookingId());
        seatSwap.setRequesterPassengerId(request.getRequesterPassengerId());
        seatSwap.setRequesterCurrentSeatId(request.getRequesterCurrentSeatId());
        seatSwap.setTargetSeatId(request.getTargetSeatId());
        seatSwap.setTargetPassengerId(null);
        seatSwap.setSwapType("AVAILABLE");
        seatSwap.setStatus("COMPLETED");
        seatSwap.setSwapCharge(BigDecimal.ZERO);
        seatSwap.setPaymentStatus("SUCCESS");
        seatSwap.setCreatedAt(LocalDateTime.now());

        SeatSwap savedSwap = seatSwapRepository.save(seatSwap);

        SeatSwapResponseDto response = new SeatSwapResponseDto();
        response.setSwapId(savedSwap.getSwapId());
        response.setStatus("COMPLETED");
        response.setMessage("Available seat swap completed successfully after payment.");
        return response;
    }

    public String respondToSwapRequest(String rawToken, String action) {
        String hashedToken = hashToken(rawToken);

        SeatSwap seatSwap = seatSwapRepository.findByRequestToken(hashedToken)
                .orElseThrow(() -> new RuntimeException("Invalid swap request token"));

        if (seatSwap.getExpiryTime() == null || seatSwap.getExpiryTime().isBefore(LocalDateTime.now())) {
            seatSwap.setStatus("EXPIRED");
            seatSwapRepository.save(seatSwap);
            return "This seat swap request has expired.";
        }

        if (!"EMAIL_SENT".equalsIgnoreCase(seatSwap.getStatus())) {
            return "This seat swap request is already processed.";
        }

        if ("accept".equalsIgnoreCase(action)) {
            seatSwap.setStatus("ACCEPTED");
            seatSwapRepository.save(seatSwap);
            return "Seat swap request accepted successfully. Payment can be done now.";
        }

        if ("reject".equalsIgnoreCase(action)) {
            seatSwap.setStatus("REJECTED");
            seatSwapRepository.save(seatSwap);
            return "Seat swap request rejected successfully.";
        }

        throw new RuntimeException("Invalid action. Use accept or reject.");
    }

    public Map<String, Object> createPaymentOrder(Integer swapId) {
        SeatSwap swap = seatSwapRepository.findById(swapId)
                .orElseThrow(() -> new RuntimeException("Swap not found"));

        if (!"ACCEPTED".equalsIgnoreCase(swap.getStatus())) {
            throw new RuntimeException("Swap not accepted yet");
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            BigDecimal swapCharge = swap.getSwapCharge() == null ? new BigDecimal("100.00") : swap.getSwapCharge();
            int amountInPaise = swapCharge.multiply(new BigDecimal("100")).intValue();

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "swap_" + swapId);

            Order order = razorpay.orders.create(options);

            swap.setPaymentStatus("PENDING");
            seatSwapRepository.save(swap);

            Map<String, Object> response = new HashMap<>();
            response.put("swapId", swap.getSwapId());
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("key", razorpayKeyId);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Payment creation failed: " + e.getMessage(), e);
        }
    }

    private String generateRawToken() {
        return UUID.randomUUID().toString().replace("-", "") + System.currentTimeMillis();
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }

    public SeatSwapResponseDto completeBookedSeatSwapPayment(SwapPaymentSuccessDto request) {
    SeatSwap seatSwap = seatSwapRepository.findById(request.getSwapId())
            .orElseThrow(() -> new RuntimeException("Swap request not found"));

    if (!"ACCEPTED".equalsIgnoreCase(seatSwap.getStatus())) {
        throw new RuntimeException("Swap request is not accepted yet");
    }

    Passenger requesterPassenger = passengerRepository.findById(seatSwap.getRequesterPassengerId())
            .orElseThrow(() -> new RuntimeException("Requester passenger not found"));

    Passenger targetPassenger = passengerRepository.findById(seatSwap.getTargetPassengerId())
            .orElseThrow(() -> new RuntimeException("Target passenger not found"));

    Seat requesterSeat = seatRepository.findById(seatSwap.getRequesterCurrentSeatId())
            .orElseThrow(() -> new RuntimeException("Requester seat not found"));

    Seat targetSeat = seatRepository.findById(seatSwap.getTargetSeatId())
            .orElseThrow(() -> new RuntimeException("Target seat not found"));

    Integer requesterOldSeatId = requesterPassenger.getSeatId();
    Integer targetOldSeatId = targetPassenger.getSeatId();

    if (!requesterOldSeatId.equals(seatSwap.getRequesterCurrentSeatId())) {
        throw new RuntimeException("Requester passenger is no longer on original seat");
    }

    if (!targetOldSeatId.equals(seatSwap.getTargetSeatId())) {
        throw new RuntimeException("Target passenger is no longer on target seat");
    }

    requesterPassenger.setSeatId(targetOldSeatId);
    requesterPassenger.setCoachNumber(targetSeat.getCoachNumber());
    requesterPassenger.setSeatStatus("BOOKED");

    targetPassenger.setSeatId(requesterOldSeatId);
    targetPassenger.setCoachNumber(requesterSeat.getCoachNumber());
    targetPassenger.setSeatStatus("BOOKED");

    passengerRepository.save(requesterPassenger);
    passengerRepository.save(targetPassenger);

    seatSwap.setStatus("COMPLETED");
    seatSwap.setPaymentStatus("SUCCESS");
    seatSwapRepository.save(seatSwap);

    SeatSwapResponseDto response = new SeatSwapResponseDto();
    response.setSwapId(seatSwap.getSwapId());
    response.setStatus("COMPLETED");
    response.setMessage("Booked seat swap completed successfully after payment.");
    return response;
}

public Map<String, Object> createAvailableSeatSwapPaymentOrder(CreateSeatSwapRequestDto request) {
    Booking booking = bookingRepository.findById(request.getRequesterBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    Passenger passenger = passengerRepository.findById(request.getRequesterPassengerId())
            .orElseThrow(() -> new RuntimeException("Passenger not found"));

    if (!booking.getBookingId().equals(passenger.getBookingId())) {
        throw new RuntimeException("Passenger does not belong to this booking");
    }

    if (request.getRequesterCurrentSeatId() == null || request.getTargetSeatId() == null) {
        throw new RuntimeException("Current seat and target seat are required");
    }

    if (request.getRequesterCurrentSeatId().equals(request.getTargetSeatId())) {
        throw new RuntimeException("Current seat and target seat cannot be same");
    }

    if (!request.getRequesterCurrentSeatId().equals(passenger.getSeatId())) {
        throw new RuntimeException("Current seat does not belong to selected passenger");
    }

    if (booking.getJourneyDate() == null) {
        throw new RuntimeException("Journey date not found for booking");
    }

    Seat currentSeat = seatRepository.findById(request.getRequesterCurrentSeatId())
            .orElseThrow(() -> new RuntimeException("Current seat not found"));

    Seat targetSeat = seatRepository.findById(request.getTargetSeatId())
            .orElseThrow(() -> new RuntimeException("Target seat not found"));

    if (!currentSeat.getTrainId().equals(targetSeat.getTrainId())) {
        throw new RuntimeException("Target seat must belong to same train");
    }

    if (!"AVAILABLE".equalsIgnoreCase(targetSeat.getStatus())) {
        throw new RuntimeException("Target seat is not available");
    }

    SeatAvailability targetAvailability = seatAvailabilityRepository
            .findBySeatIdAndJourneyDate(targetSeat.getSeatId(), booking.getJourneyDate())
            .orElseThrow(() -> new RuntimeException("Target seat availability not found"));

    if (!"AVAILABLE".equalsIgnoreCase(targetAvailability.getStatus())) {
        throw new RuntimeException("Target seat is no longer available for this journey");
    }

    try {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        BigDecimal swapCharge = new BigDecimal("100.00");
        int amountInPaise = swapCharge.multiply(new BigDecimal("100")).intValue();

        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", "available_swap_" + request.getRequesterBookingId() + "_" + request.getRequesterPassengerId());

        Order order = razorpay.orders.create(options);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("key", razorpayKeyId);

        response.put("requesterBookingId", request.getRequesterBookingId());
        response.put("requesterPassengerId", request.getRequesterPassengerId());
        response.put("requesterCurrentSeatId", request.getRequesterCurrentSeatId());
        response.put("targetSeatId", request.getTargetSeatId());

        return response;

    } catch (Exception e) {
        throw new RuntimeException("Available seat payment creation failed: " + e.getMessage(), e);
    }
}
}