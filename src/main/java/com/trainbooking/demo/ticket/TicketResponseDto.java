package com.trainbooking.demo.ticket;

import java.util.List;

public class TicketResponseDto {

    private String pnrNumber;
    private String trainName;
    private String source;
    private String destination;
    private String status;

    private List<PassengerInfo> passengers;

    public static class PassengerInfo {
        private String name;
        private Integer age;
        private String gender;
        private Integer seatId;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public Integer getSeatId() { return seatId; }
        public void setSeatId(Integer seatId) { this.seatId = seatId; }
    }

    public String getPnrNumber() { return pnrNumber; }
    public void setPnrNumber(String pnrNumber) { this.pnrNumber = pnrNumber; }

    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<PassengerInfo> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerInfo> passengers) { this.passengers = passengers; }
}