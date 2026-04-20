import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Booking.css";

import BackButton from "../components/BackButton";

const Booking = () => {
  const navigate = useNavigate();

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [formData, setFormData] = useState({
    passengerName: "",
    age: "",
    gender: "",
    berthPreference: "",
    mobile: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedTrain = localStorage.getItem("selectedTrain");

    if (storedTrain) {
      setSelectedTrain(JSON.parse(storedTrain));
    } else {
      setMessage("No train selected");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContinue = () => {
    if (
      !formData.passengerName ||
      !formData.age ||
      !formData.gender ||
      !formData.mobile
    ) {
      setMessage("Please fill all required passenger details");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const bookingData = {
      train: selectedTrain,
      passenger: formData,
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    if (!token || !userId) {
      localStorage.setItem("redirectAfterLogin", "/payment");
      setMessage("Please login first to continue booking");
      navigate("/login");
      return;
    }

    setMessage("");
    navigate("/payment");
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <BackButton />
        <h2>Passenger Booking Details</h2>

        {message && <p className="booking-message">{message}</p>}

        {selectedTrain && (
          <div className="train-summary-box">
            <h3>
              {selectedTrain.trainName} ({selectedTrain.trainNumber})
            </h3>
            <p>
              <strong>Route:</strong> {selectedTrain.fromStation} → {selectedTrain.toStation}
            </p>
            <p>
              <strong>Departure:</strong> {selectedTrain.departureTime}
            </p>
            <p>
              <strong>Arrival:</strong> {selectedTrain.arrivalTime}
            </p>
            <p>
              <strong>Class:</strong> {selectedTrain.classType}
            </p>
            <p>
              <strong>Fare:</strong> ₹{selectedTrain.fare}
            </p>
          </div>
        )}

        <div className="booking-form">
          <input
            type="text"
            name="passengerName"
            placeholder="Passenger Name"
            value={formData.passengerName}
            onChange={handleChange}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select
            name="berthPreference"
            value={formData.berthPreference}
            onChange={handleChange}
          >
            <option value="">Berth Preference</option>
            <option>Lower</option>
            <option>Middle</option>
            <option>Upper</option>
            <option>Side Lower</option>
            <option>Side Upper</option>
          </select>

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />

          <button onClick={handleContinue}>Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
};

export default Booking;