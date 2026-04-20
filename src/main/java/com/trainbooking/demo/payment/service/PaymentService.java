package com.trainbooking.demo.payment.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.trainbooking.demo.booking.Booking;
import com.trainbooking.demo.booking.BookingRepository;
import com.trainbooking.demo.passenger.Passenger;
import com.trainbooking.demo.passenger.PassengerRepository;
import com.trainbooking.demo.payment.dto.CreateRazorpayOrderRequestDto;
import com.trainbooking.demo.payment.dto.PaymentResponseDto;
import com.trainbooking.demo.payment.dto.RazorpayVerifyRequestDto;
import com.trainbooking.demo.payment.entity.Payment;
import com.trainbooking.demo.payment.enums.PaymentStatus;
import com.trainbooking.demo.payment.repository.PaymentRepository;
import com.trainbooking.demo.seats.Seat;
import com.trainbooking.demo.seats.SeatAvailability;
import com.trainbooking.demo.seats.SeatAvailabilityRepository;
import com.trainbooking.demo.seats.SeatRepository;
import com.trainbooking.demo.ticket.Ticket;
import com.trainbooking.demo.ticket.TicketRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private SeatAvailabilityRepository seatAvailabilityRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentResponseDto createRazorpayOrder(CreateRazorpayOrderRequestDto requestDto) throws Exception {

        Booking booking = bookingRepository.findById(requestDto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + requestDto.getBookingId()));

        if (booking.getUserId() == null || !booking.getUserId().equals(requestDto.getUserId())) {
            throw new RuntimeException("User is not authorized for this booking");
        }

        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Payment cannot be created. Booking is already confirmed.");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Payment cannot be created. Booking is cancelled.");
        }

        Integer nextAttempt = paymentRepository.findByBookingId(requestDto.getBookingId())
                .stream()
                .map(Payment::getAttemptNumber)
                .filter(attempt -> attempt != null)
                .max(Integer::compareTo)
                .orElse(0) + 1;

        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", requestDto.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + requestDto.getBookingId() + "_attempt_" + nextAttempt);

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setBookingId(requestDto.getBookingId());
        payment.setUserId(requestDto.getUserId());
        payment.setAmount(requestDto.getAmount());
        payment.setCurrency("INR");
        payment.setPaymentMethod(requestDto.getPaymentMethod());
        payment.setGatewayName("RAZORPAY");
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setAttemptNumber(nextAttempt);
        payment.setGatewayOrderId(razorpayOrder.get("id"));

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    public PaymentResponseDto verifyRazorpayPayment(RazorpayVerifyRequestDto requestDto) throws Exception {

        Payment payment = paymentRepository.findById(requestDto.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + requestDto.getPaymentId()));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + payment.getBookingId()));

        Ticket ticket = ticketRepository.findByBookingId(booking.getBookingId())
                .orElseThrow(() -> new RuntimeException("Ticket not found for booking id: " + booking.getBookingId()));

        if (payment.getGatewayOrderId() == null) {
            throw new RuntimeException("No Razorpay order found for this payment");
        }

        if (!payment.getGatewayOrderId().equals(requestDto.getRazorpayOrderId())) {
            throw new RuntimeException("Razorpay order id mismatch");
        }

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", requestDto.getRazorpayOrderId());
        options.put("razorpay_payment_id", requestDto.getRazorpayPaymentId());
        options.put("razorpay_signature", requestDto.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

        List<Passenger> passengers = passengerRepository.findByBookingId(booking.getBookingId());

        if (!isValid) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Invalid Razorpay signature");
            paymentRepository.save(payment);

            booking.setStatus("PAYMENT_FAILED");
            bookingRepository.save(booking);

            for (Passenger p : passengers) {
                Seat seat = seatRepository.findById(p.getSeatId())
                        .orElseThrow(() -> new RuntimeException("Seat not found with id: " + p.getSeatId()));

                seat.setStatus("AVAILABLE");
                seatRepository.save(seat);

                if (booking.getJourneyDate() != null) {
                    seatAvailabilityRepository
                            .findBySeatIdAndJourneyDate(p.getSeatId(), booking.getJourneyDate())
                            .ifPresent(availability -> {
                                availability.setStatus("AVAILABLE");
                                seatAvailabilityRepository.save(availability);
                            });
                }

                p.setSeatStatus("PAYMENT_FAILED");
                passengerRepository.save(p);
            }

            ticket.setTicketStatus("PAYMENT_FAILED");
            ticketRepository.save(ticket);

            throw new RuntimeException("Payment signature verification failed");
        }

        payment.setGatewayPaymentId(requestDto.getRazorpayPaymentId());
        payment.setGatewaySignature(requestDto.getRazorpaySignature());
        payment.setTransactionId(requestDto.getRazorpayPaymentId());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentTime(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);

        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        for (Passenger p : passengers) {
            Seat seat = seatRepository.findById(p.getSeatId())
                    .orElseThrow(() -> new RuntimeException("Seat not found with id: " + p.getSeatId()));

            seat.setStatus("BOOKED");
            seatRepository.save(seat);

            if (booking.getJourneyDate() != null) {
                SeatAvailability availability = seatAvailabilityRepository
                        .findBySeatIdAndJourneyDate(p.getSeatId(), booking.getJourneyDate())
                        .orElseThrow(() -> new RuntimeException(
                                "Seat availability not found for seat id: " + p.getSeatId()
                                        + " and date: " + booking.getJourneyDate()
                        ));

                availability.setStatus("BOOKED");
                seatAvailabilityRepository.save(availability);
            }

            p.setSeatStatus("BOOKED");
            passengerRepository.save(p);
        }

        ticket.setTicketStatus("CONFIRMED");
        ticketRepository.save(ticket);

        return mapToResponse(updatedPayment);
    }

    public PaymentResponseDto getLatestPaymentByBookingId(Integer bookingId) {
        Payment payment = paymentRepository.findTopByBookingIdOrderByPaymentIdDesc(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking id: " + bookingId));

        return mapToResponse(payment);
    }

    public PaymentResponseDto markPaymentFailed(Integer paymentId, String failureReason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + payment.getBookingId()));

        Ticket ticket = ticketRepository.findByBookingId(booking.getBookingId())
                .orElseThrow(() -> new RuntimeException("Ticket not found for booking id: " + booking.getBookingId()));

        List<Passenger> passengers = passengerRepository.findByBookingId(booking.getBookingId());

        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setFailureReason(failureReason);

        Payment updatedPayment = paymentRepository.save(payment);

        booking.setStatus("PAYMENT_FAILED");
        bookingRepository.save(booking);

        for (Passenger p : passengers) {
            Seat seat = seatRepository.findById(p.getSeatId())
                    .orElseThrow(() -> new RuntimeException("Seat not found with id: " + p.getSeatId()));

            seat.setStatus("AVAILABLE");
            seatRepository.save(seat);

            if (booking.getJourneyDate() != null) {
                seatAvailabilityRepository
                        .findBySeatIdAndJourneyDate(p.getSeatId(), booking.getJourneyDate())
                        .ifPresent(availability -> {
                            availability.setStatus("AVAILABLE");
                            seatAvailabilityRepository.save(availability);
                        });
            }

            p.setSeatStatus("PAYMENT_FAILED");
            passengerRepository.save(p);
        }

        ticket.setTicketStatus("PAYMENT_FAILED");
        ticketRepository.save(ticket);

        return mapToResponse(updatedPayment);
    }

    private PaymentResponseDto mapToResponse(Payment payment) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setPaymentId(payment.getPaymentId());
        dto.setBookingId(payment.getBookingId());
        dto.setUserId(payment.getUserId());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setPaymentStatus(payment.getPaymentStatus() != null ? payment.getPaymentStatus().name() : null);
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setGatewayName(payment.getGatewayName());
        dto.setGatewayOrderId(payment.getGatewayOrderId());
        dto.setGatewayPaymentId(payment.getGatewayPaymentId());
        dto.setGatewaySignature(payment.getGatewaySignature());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentTime(payment.getPaymentTime());
        return dto;
    }
}