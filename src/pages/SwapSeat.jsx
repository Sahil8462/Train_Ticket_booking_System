import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SwapSeat.css";
import { getSwapPnrDetails } from "../Services/api";

import BackButton from "../components/BackButton";

const PENDING_SWAP_PNR_KEY = "pendingSwapPnr";

const SwapSeat = () => {
  const navigate = useNavigate();

  const [pnr, setPnr] = useState("");
  const [pnrDetails, setPnrDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    return Boolean(token && userId);
  };

  const normalizePnrResponse = (data, fallbackPnr) => {
    const bookingId = data?.bookingId ?? data?.booking?.bookingId ?? null;
    const trainId = data?.trainId ?? data?.booking?.trainId ?? null;
    const journeyDate = data?.journeyDate ?? data?.booking?.journeyDate ?? null;
    const destination = data?.destination ?? data?.booking?.destination ?? "";
    const source = data?.source ?? data?.booking?.source ?? "";
    const trainName = data?.trainName ?? data?.booking?.trainName ?? "";
    const trainNumber = data?.trainNumber ?? data?.booking?.trainNumber ?? "";
    const duration = data?.duration ?? data?.booking?.duration ?? "";
    const pnrNumber = data?.pnrNumber ?? data?.booking?.pnrNumber ?? fallbackPnr;

    const rawPassengers = Array.isArray(data?.passengers)
      ? data.passengers
      : Array.isArray(data?.booking?.passengers)
      ? data.booking.passengers
      : [];

    const passengers = rawPassengers.map((passenger) => ({
      passengerId: passenger.passengerId ?? passenger.passenger_id ?? "",
      passengerName:
        passenger.passengerName ??
        passenger.name ??
        passenger.passenger_name ??
        "Passenger",
      age: passenger.age ?? "",
      gender: passenger.gender ?? "",
      seatId: passenger.seatId ?? passenger.seat_id ?? "",
      seatNumber: passenger.seatNumber ?? passenger.seat_number ?? "",
      coachNumber: passenger.coachNumber ?? passenger.coach_number ?? "N/A",
      seatStatus: passenger.seatStatus ?? passenger.seat_status ?? "",
      seatType: passenger.seatType ?? passenger.seat_type ?? "",
    }));

    return {
      bookingId,
      trainId,
      journeyDate,
      destination,
      source,
      trainName,
      trainNumber,
      duration,
      pnrNumber,
      passengers,
    };
  };

  const fetchPnrDetails = async (pnrValue) => {
    try {
      setLoading(true);
      setMessage("");
      setPnrDetails(null);

      const data = await getSwapPnrDetails(pnrValue);
      const normalized = normalizePnrResponse(data, pnrValue);

      if (!normalized.bookingId) {
        throw new Error("Booking details not found for this PNR");
      }

      setPnrDetails(normalized);
      setMessage("PNR details loaded successfully");
      sessionStorage.removeItem(PENDING_SWAP_PNR_KEY);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch PNR details"
      );
      setPnrDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPnr = async () => {
    const pnrValue = pnr.trim();

    if (!pnrValue) {
      setMessage("Please enter PNR number");
      setPnrDetails(null);
      return;
    }

    if (!isLoggedIn()) {
      localStorage.setItem("redirectAfterLogin", "/swap-seat");
      sessionStorage.setItem(PENDING_SWAP_PNR_KEY, pnrValue);
      navigate("/login");
      return;
    }

    await fetchPnrDetails(pnrValue);
  };

  const handleSelectPassenger = (passenger) => {
    navigate("/swap-seat/options", {
      state: {
        pnrDetails,
        selectedPassenger: passenger,
      },
    });
  };

  const handlePnrKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchPnr();
    }
  };

  useEffect(() => {
    const pendingPnr = sessionStorage.getItem(PENDING_SWAP_PNR_KEY);

    if (isLoggedIn() && pendingPnr && !pnrDetails && !loading) {
      setPnr(pendingPnr);
      fetchPnrDetails(pendingPnr);
    }
  }, [pnrDetails, loading]);

  return (
    <div className="swap-page">
      <div className="swap-container">
        <BackButton />
        <h2>Seat Swap Request</h2>
        <p className="subtitle">Search your PNR to begin seat swap</p>

        <div className="swap-form">
          <input
            type="text"
            name="pnr"
            placeholder="Enter PNR Number"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            onKeyDown={handlePnrKeyDown}
          />

          <button onClick={handleSearchPnr} disabled={loading}>
            {loading ? "Searching..." : "Search PNR"}
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        {pnrDetails && (
          <div className="suggestion-box">
            <h3>PNR Details</h3>

            <div className="pnr-info">
              <p>
                <strong>PNR:</strong> {pnrDetails.pnrNumber}
              </p>
              <p>
                <strong>Booking ID:</strong> {pnrDetails.bookingId}
              </p>
              <p>
                <strong>Journey Date:</strong> {pnrDetails.journeyDate}
              </p>
              <p>
                <strong>Destination:</strong> {pnrDetails.destination || "N/A"}
              </p>

              {pnrDetails.source && (
                <p>
                  <strong>Source:</strong> {pnrDetails.source}
                </p>
              )}

              {pnrDetails.trainName && (
                <p>
                  <strong>Train Name:</strong> {pnrDetails.trainName}
                </p>
              )}

              {pnrDetails.trainNumber && (
                <p>
                  <strong>Train Number:</strong> {pnrDetails.trainNumber}
                </p>
              )}

              {pnrDetails.trainId && (
                <p>
                  <strong>Train ID:</strong> {pnrDetails.trainId}
                </p>
              )}

              {pnrDetails.duration && (
                <p>
                  <strong>Duration:</strong> {pnrDetails.duration}
                </p>
              )}
            </div>

            {pnrDetails.passengers?.length > 0 ? (
              <div className="passenger-list">
                <h3 className="passenger-title">Passengers</h3>

                {pnrDetails.passengers.map((passenger) => (
                  <div
                    key={passenger.passengerId}
                    className="passenger-card selectable-passenger-card"
                  >
                    <div className="passenger-card-left">
                      <p>
                        <strong>Name:</strong> {passenger.passengerName}
                      </p>
                      <p>
                        <strong>Age:</strong> {passenger.age || "N/A"}
                      </p>
                      <p>
                        <strong>Gender:</strong> {passenger.gender || "N/A"}
                      </p>
                      <p>
                        <strong>Passenger ID:</strong> {passenger.passengerId}
                      </p>
                      <p>
                        <strong>Coach:</strong> {passenger.coachNumber}
                      </p>
                      <p>
                        <strong>Seat ID:</strong> {passenger.seatId}
                      </p>
                      <p>
                        <strong>Seat Number:</strong> {passenger.seatNumber || "N/A"}
                      </p>
                      <p>
                        <strong>Seat Type:</strong> {passenger.seatType || "N/A"}
                      </p>
                      <p>
                        <strong>Seat Status:</strong> {passenger.seatStatus || "N/A"}
                      </p>
                    </div>

                    <div className="passenger-card-right">
                      <button
                        className="select-passenger-btn"
                        onClick={() => handleSelectPassenger(passenger)}
                      >
                        Select for Swap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="message">No passengers found for this PNR.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapSeat;