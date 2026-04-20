import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PassengersDetails.css";

import BackButton from "../components/BackButton";
import {
  addPassenger,
  getPassengers,
  finalizeBooking,
} from "../Services/api";

const PassengersDetails = () => {
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const draftId = localStorage.getItem("draftId");

  useEffect(() => {
    const storedBooking = localStorage.getItem("bookingData");

    if (storedBooking) {
      try {
        const parsedBooking = JSON.parse(storedBooking);
        setBookingData(parsedBooking);

        // Agar bookingData me pehle se passengers saved hain to wahi restore karo
        if (
          parsedBooking?.passengers &&
          Array.isArray(parsedBooking.passengers) &&
          parsedBooking.passengers.length > 0
        ) {
          setPassengers(parsedBooking.passengers);
        } else {
          const seatCount = parsedBooking?.seats?.length || 1;

          const initialPassengers = Array.from(
            { length: seatCount },
            (_, index) => ({
              passengerName: "",
              age: "",
              gender: "",
              berthPreference: parsedBooking?.seats?.[index]?.berth || "",
            })
          );

          setPassengers(initialPassengers);
        }
      } catch (error) {
        console.error("Booking parse error:", error);
        setMessage("Invalid booking data");
      }
    } else {
      setMessage("No booking data found");
    }
  }, []);

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;

    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [name]: value } : p))
    );
  };

  const validatePassengers = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      if (!p.passengerName?.trim()) {
        setMessage(`Enter name for Passenger ${i + 1}`);
        return false;
      }

      if (!p.age) {
        setMessage(`Enter age for Passenger ${i + 1}`);
        return false;
      }

      if (!p.gender) {
        setMessage(`Select gender for Passenger ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const calculateFare = () => {
    const baseFare = Number(bookingData?.train?.fare || 0);
    return baseFare * passengers.length;
  };

  const handleContinueToPayment = async () => {
    if (!validatePassengers()) return;

    const updatedBookingData = {
      ...bookingData,
      passengers,
      totalFare: calculateFare(),
    };

    // Passenger details save kar do taki login ke baad data wapas aaye
    localStorage.setItem("bookingData", JSON.stringify(updatedBookingData));
    setBookingData(updatedBookingData);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Login nahi hai to login page par bhejo
    if (!token || !userId) {
      localStorage.setItem("redirectAfterLogin", "/passengers-details");
      setMessage("Please login first to continue");
      navigate("/login");
      return;
    } 

    if (!draftId) {
      setMessage("Draft ID missing. Restart booking.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      for (const p of passengers) {
        await addPassenger({
          draftId,
          passengerName: p.passengerName,
          age: Number(p.age),
          gender: p.gender,
        });
      }

      const list = await getPassengers(draftId);
      console.log("Passengers saved:", list);

      const bookingResponse = await finalizeBooking(draftId, Number(userId));
      console.log("FINAL BOOKING RESPONSE 👉", bookingResponse);

      localStorage.setItem("finalBooking", JSON.stringify(bookingResponse));

      navigate("/payment");
    } catch (error) {
      console.error("Passenger / booking error:", error);
      setMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <BackButton />
        <h2>Passenger Details</h2>

        {message && <p className="booking-message">{message}</p>}

        {!bookingData ? (
          <div className="train-summary-box">
            <p>No booking data available</p>
          </div>
        ) : (
          <>
            <div className="train-summary-box">
              <h3>Journey Summary</h3>

              <p>
                <strong>Train:</strong> {bookingData.train?.trainName} (
                {bookingData.train?.trainNumber})
              </p>

              <p>
                <strong>Route:</strong> {bookingData.train?.fromStation} →{" "}
                {bookingData.train?.toStation}
              </p>

              <p>
                <strong>Coach:</strong> {bookingData.coach}
              </p>

              <p>
                <strong>Seats:</strong>{" "}
                {bookingData.seats
                  ?.map((s) => `${s.seatNumber} (${s.berth})`)
                  .join(", ")}
              </p>

              <p>
                <strong>Total Fare:</strong> ₹{calculateFare()}
              </p>
            </div>

            {passengers.map((p, i) => (
              <div key={i} className="train-summary-box">
                <h3>Passenger {i + 1}</h3>

                <input
                  type="text"
                  name="passengerName"
                  placeholder="Name"
                  value={p.passengerName}
                  onChange={(e) => handlePassengerChange(i, e)}
                />

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) => handlePassengerChange(i, e)}
                />

                <select
                  name="gender"
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(i, e)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  value={p.berthPreference}
                  readOnly
                  placeholder="Berth Preference"
                />
              </div>
            ))}

            <button onClick={handleContinueToPayment} disabled={loading}>
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PassengersDetails;