package com.trainbooking.demo.ticket;

import java.time.LocalDate;
import java.util.List;

public class SwapTicketLookupResponseDto {

    private Integer bookingId;
    private Integer trainId;
    private String pnrNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDate journeyDate;
    private String status;
    private List<PassengerSwapInfo> passengers;

    public static class PassengerSwapInfo {
        private Integer passengerId;
        private String name;
        private Integer age;
        private String gender;
        private Integer seatId;
        private String coachNumber;
        private Integer seatNumber;
        private String seatType;
        private String seatStatus;

        public Integer getPassengerId() {
            return passengerId;
        }

        public void setPassengerId(Integer passengerId) {
            this.passengerId = passengerId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public Integer getSeatId() {
            return seatId;
        }

        public void setSeatId(Integer seatId) {
            this.seatId = seatId;
        }

        public String getCoachNumber() {
            return coachNumber;
        }

        public void setCoachNumber(String coachNumber) {
            this.coachNumber = coachNumber;
        }

        public Integer getSeatNumber() {
            return seatNumber;
        }

        public void setSeatNumber(Integer seatNumber) {
            this.seatNumber = seatNumber;
        }

        public String getSeatType() {
            return seatType;
        }

        public void setSeatType(String seatType) {
            this.seatType = seatType;
        }

        public String getSeatStatus() {
            return seatStatus;
        }

        public void setSeatStatus(String seatStatus) {
            this.seatStatus = seatStatus;
        }
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getTrainId() {
        return trainId;
    }

    public void setTrainId(Integer trainId) {
        this.trainId = trainId;
    }

    public String getPnrNumber() {
        return pnrNumber;
    }

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(LocalDate journeyDate) {
        this.journeyDate = journeyDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PassengerSwapInfo> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerSwapInfo> passengers) {
        this.passengers = passengers;
    }
}