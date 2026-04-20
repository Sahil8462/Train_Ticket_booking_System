package com.trainbooking.demo.payment.repository;

import com.trainbooking.demo.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findTopByBookingIdOrderByPaymentIdDesc(Integer bookingId);

    List<Payment> findByBookingId(Integer bookingId);
}