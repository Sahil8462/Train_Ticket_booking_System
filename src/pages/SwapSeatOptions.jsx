import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SwapSeat.css";
import { getSwapSeatOptions } from "../Services/api";

import BackButton from "../components/BackButton";

const SwapSeatOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pnrDetails = location.state?.pnrDetails;
  const selectedPassenger = location.state?.selectedPassenger;

  const [seatData, setSeatData] = useState([]);
  const [selectedTargetSeat, setSelectedTargetSeat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pnrDetails || !selectedPassenger) {
      navigate("/swap-seat");
      return;
    }

    const fetchSeatOptions = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await getSwapSeatOptions(
          pnrDetails.trainId,
          pnrDetails.journeyDate,
          selectedPassenger.seatId
        );

        const normalizedSeats = Array.isArray(response)
          ? response
          : Array.isArray(response?.seats)
          ? response.seats
          : [];

        setSeatData(normalizedSeats);
      } catch (error) {
        setMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load seat options"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeatOptions();
  }, [pnrDetails, selectedPassenger, navigate]);

  const groupedSeats = useMemo(() => {
    const grouped = {};

    seatData.forEach((seat) => {
      const coach = seat.coachNumber || "Unknown Coach";

      if (!grouped[coach]) {
        grouped[coach] = [];
      }

      grouped[coach].push(seat);
    });

    const sortedGrouped = {};

    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .forEach((coach) => {
        sortedGrouped[coach] = grouped[coach].sort((a, b) => {
          const aNum = Number(a.seatNumber) || 0;
          const bNum = Number(b.seatNumber) || 0;
          return aNum - bNum;
        });
      });

    return sortedGrouped;
  }, [seatData]);

  const getSeatClassName = (seat) => {
    const isCurrentSeat =
      Number(seat.seatId) === Number(selectedPassenger.seatId);
    const isSelectedSeat =
      Number(selectedTargetSeat?.seatId) === Number(seat.seatId);

    if (isCurrentSeat) return "seat-tile current-seat";
    if (isSelectedSeat) return "seat-tile selected-seat";
    if (seat.status === "BOOKED") return "seat-tile booked-seat";
    if (seat.status === "AVAILABLE") return "seat-tile available-seat";

    return "seat-tile disabled-seat";
  };

  const handleSeatSelect = (seat) => {
    const isCurrentSeat =
      Number(seat.seatId) === Number(selectedPassenger.seatId);

    if (isCurrentSeat) return;

    setSelectedTargetSeat(seat);
  };

  const handleContinue = () => {
    if (!selectedTargetSeat) {
      setMessage("Please select a target seat first.");
      return;
    }

    navigate("/swap-seat/confirm", {
      state: {
        pnrDetails,
        selectedPassenger,
        selectedTargetSeat,
      },
    });
  };

  if (!pnrDetails || !selectedPassenger) return null;

  return (
    <div className="swap-page">
      <div className="swap-container swap-options-container">
        <div className="swap-options-header">
          <BackButton />
          <div>
            <h2>Select Seat for Swap</h2>
            <p className="subtitle">
              Choose a target seat for passenger seat swap.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/swap-seat")}
          >
            Back to PNR Search
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="swap-options-layout">
          <div className="swap-left-panel">
            <div className="suggestion-box">
              <h3>Selected Passenger</h3>

              <div className="pnr-info two-column-info">
                <p>
                  <strong>PNR:</strong> {pnrDetails.pnrNumber}
                </p>
                <p>
                  <strong>Journey Date:</strong> {pnrDetails.journeyDate}
                </p>
                <p>
                  <strong>Passenger Name:</strong>{" "}
                  {selectedPassenger.passengerName}
                </p>
                <p>
                  <strong>Age:</strong> {selectedPassenger.age || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedPassenger.gender || "N/A"}
                </p>
                <p>
                  <strong>Coach:</strong> {selectedPassenger.coachNumber}
                </p>
                <p>
                  <strong>Current Seat ID:</strong> {selectedPassenger.seatId}
                </p>
                <p>
                  <strong>Current Seat Number:</strong>{" "}
                  {selectedPassenger.seatNumber}
                </p>
                <p>
                  <strong>Seat Type:</strong>{" "}
                  {selectedPassenger.seatType || "N/A"}
                </p>
                <p>
                  <strong>Train:</strong> {pnrDetails.trainName || "N/A"}
                </p>
                <p>
                  <strong>Source:</strong> {pnrDetails.source || "N/A"}
                </p>
                <p>
                  <strong>Destination:</strong> {pnrDetails.destination || "N/A"}
                </p>
              </div>
            </div>

            <div className="suggestion-box swap-legend-box">
              <h3>Seat Legend</h3>

              <div className="seat-legend">
                <div className="legend-item">
                  <span className="legend-color available-seat"></span>
                  <span>Available</span>
                </div>

                <div className="legend-item">
                  <span className="legend-color booked-seat"></span>
                  <span>Booked</span>
                </div>

                <div className="legend-item">
                  <span className="legend-color current-seat"></span>
                  <span>Current Seat</span>
                </div>

                <div className="legend-item">
                  <span className="legend-color selected-seat"></span>
                  <span>Selected Target</span>
                </div>
              </div>
            </div>

            {selectedTargetSeat && (
              <div className="suggestion-box selected-seat-summary">
                <h3>Selected Target Seat</h3>

                <div className="pnr-info">
                  <p>
                    <strong>Coach:</strong> {selectedTargetSeat.coachNumber}
                  </p>
                  <p>
                    <strong>Seat Number:</strong>{" "}
                    {selectedTargetSeat.seatNumber}
                  </p>
                  <p>
                    <strong>Seat ID:</strong> {selectedTargetSeat.seatId}
                  </p>
                  <p>
                    <strong>Seat Type:</strong>{" "}
                    {selectedTargetSeat.seatType || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedTargetSeat.status}
                  </p>
                  <p>
                    <strong>Swap Type:</strong>{" "}
                    {selectedTargetSeat.status === "AVAILABLE"
                      ? "Direct Swap"
                      : "Request Swap"}
                  </p>
                  <p>
                    <strong>Next Step:</strong>{" "}
                    {selectedTargetSeat.status === "AVAILABLE"
                      ? "Payment and confirmation"
                      : "Send request to booked passenger"}
                  </p>
                </div>

                <div className="swap-action-row">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setSelectedTargetSeat(null)}
                  >
                    Clear Selection
                  </button>

                  <button
                    type="button"
                    className="select-passenger-btn"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="swap-right-panel">
            <div className="suggestion-box">
              <h3>Seat Options</h3>

              {loading ? (
                <p className="message">Loading seat options...</p>
              ) : seatData.length === 0 ? (
                <p className="message">No seat options found.</p>
              ) : (
                <div className="coach-list">
                  {Object.entries(groupedSeats).map(([coachName, seats]) => (
                    <div key={coachName} className="coach-block">
                      <div className="coach-header">
                        <h4>{coachName}</h4>
                        <span>{seats.length} seats</span>
                      </div>

                      <div className="seat-grid">
                        {seats.map((seat) => {
                          const isCurrentSeat =
                            Number(seat.seatId) ===
                            Number(selectedPassenger.seatId);

                          const isSelectedSeat =
                            Number(selectedTargetSeat?.seatId) ===
                            Number(seat.seatId);

                          return (
                            <button
                              key={seat.seatId}
                              type="button"
                              className={getSeatClassName(seat)}
                              onClick={() => handleSeatSelect(seat)}
                              disabled={isCurrentSeat}
                              title={
                                isCurrentSeat
                                  ? "This is the passenger's current seat"
                                  : `${coachName} - Seat ${seat.seatNumber}`
                              }
                            >
                              <div className="seat-number">
                                {seat.seatNumber}
                              </div>

                              <div className="seat-meta">
                                <span>{seat.seatType || "N/A"}</span>
                                <span>{seat.status || "UNKNOWN"}</span>
                                {isCurrentSeat && <span>Current Seat</span>}
                                {isSelectedSeat && <span>Selected</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapSeatOptions;