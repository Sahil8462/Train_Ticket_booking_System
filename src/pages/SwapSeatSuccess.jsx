import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SwapSeat.css";

import BackButton from "../components/BackButton";

const SwapSeatSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const swapData = location.state;

  if (!swapData) {
    navigate("/swap-seat");
    return null;
  }

  const {
    type,
    pnrDetails,
    selectedPassenger,
    selectedTargetSeat,
    pricing,
    amount,
    completeResponse,
  } = swapData;

  const paidAmount = amount || pricing?.total || 0;

  return (
    <div className="swap-page">
      <div className="swap-container swap-options-container">
        <div className="swap-options-header">
          <BackButton />
          <div>
            <h2>Seat Swap Successful</h2>
            <p className="subtitle">
              Your seat swap has been completed successfully.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/swap-seat")}
          >
            Back to Swap Home
          </button>
        </div>

        <div className="suggestion-box success-box">
          <h3>Swap Status</h3>
          <div className="pnr-info">
            <p>
              <strong>Swap Type:</strong>{" "}
              {type === "available" ? "Available Seat Swap" : "Seat Swap"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {completeResponse?.status || "COMPLETED"}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              {completeResponse?.message || "Seat swap completed successfully."}
            </p>
            <p>
              <strong>Swap ID:</strong>{" "}
              {completeResponse?.swapId || "Generated"}
            </p>
          </div>
        </div>

        <div className="swap-seat-compare-grid">
          <div className="suggestion-box current-seat-card">
            <h3>Previous Seat</h3>
            <div className="pnr-info">
              <p>
                <strong>Coach:</strong> {selectedPassenger?.coachNumber || "N/A"}
              </p>
              <p>
                <strong>Seat ID:</strong> {selectedPassenger?.seatId || "N/A"}
              </p>
              <p>
                <strong>Seat Number:</strong>{" "}
                {selectedPassenger?.seatNumber || "N/A"}
              </p>
              <p>
                <strong>Seat Type:</strong>{" "}
                {selectedPassenger?.seatType || "N/A"}
              </p>
            </div>
          </div>

          <div className="suggestion-box target-seat-card">
            <h3>New Seat</h3>
            <div className="pnr-info">
              <p>
                <strong>Coach:</strong> {selectedTargetSeat?.coachNumber || "N/A"}
              </p>
              <p>
                <strong>Seat ID:</strong> {selectedTargetSeat?.seatId || "N/A"}
              </p>
              <p>
                <strong>Seat Number:</strong>{" "}
                {selectedTargetSeat?.seatNumber || "N/A"}
              </p>
              <p>
                <strong>Seat Type:</strong>{" "}
                {selectedTargetSeat?.seatType || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="suggestion-box">
          <h3>Passenger & Journey Details</h3>
          <div className="pnr-info">
            <p>
              <strong>Passenger:</strong>{" "}
              {selectedPassenger?.passengerName || "N/A"}
            </p>
            <p>
              <strong>Age:</strong> {selectedPassenger?.age || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {selectedPassenger?.gender || "N/A"}
            </p>
            <p>
              <strong>PNR:</strong> {pnrDetails?.pnrNumber || "N/A"}
            </p>
            <p>
              <strong>Train:</strong> {pnrDetails?.trainName || "N/A"}
            </p>
            <p>
              <strong>Journey Date:</strong> {pnrDetails?.journeyDate || "N/A"}
            </p>
            <p>
              <strong>Source:</strong> {pnrDetails?.source || "N/A"}
            </p>
            <p>
              <strong>Destination:</strong> {pnrDetails?.destination || "N/A"}
            </p>
          </div>
        </div>

        <div className="suggestion-box swap-charge-box">
          <h3>Payment Details</h3>

          <div className="swap-pricing-card">
            <div className="swap-pricing-row">
              <span>Swap base charge</span>
              <span>₹{pricing?.baseFare || 0}</span>
            </div>

            <div className="swap-pricing-row">
              <span>Platform fee</span>
              <span>₹{pricing?.platformFee || 0}</span>
            </div>

            <div className="swap-pricing-row">
              <span>GST</span>
              <span>₹{pricing?.gst || 0}</span>
            </div>

            <div className="swap-pricing-divider"></div>

            <div className="swap-pricing-row swap-pricing-total">
              <span>Total Paid</span>
              <span>₹{paidAmount}</span>
            </div>
          </div>

          <div className="swap-next-step-note">
            <p>
              <strong>Payment Status:</strong> Successful
            </p>
            <p>
              <strong>Seat Update:</strong> Passenger seat has been changed to
              the selected target seat.
            </p>
          </div>
        </div>

        <div className="swap-action-row">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/swap-seat")}
          >
            Back to Swap Home
          </button>

          <button
            type="button"
            className="select-passenger-btn"
            onClick={() =>
              navigate(`/ticket/${pnrDetails?.pnrNumber}`, {
                state: {
                  bookingId: pnrDetails?.bookingId,
                  pnrNumber: pnrDetails?.pnrNumber,
                },
              })
            }
          >
            View Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapSeatSuccess;