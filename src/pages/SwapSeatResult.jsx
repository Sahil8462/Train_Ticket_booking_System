import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SwapSeat.css";

import BackButton from "../components/BackButton";

const SwapSeatResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    navigate("/swap-seat");
    return null;
  }

  const {
    type,
    pnrDetails,
    selectedPassenger,
    selectedTargetSeat,
    amount,
    requestResponse,
    paymentResponse,
    paymentInitResponse,
  } = data;

  return (
    <div className="swap-page">
      <div className="swap-container swap-options-container">
        <BackButton />
        <h2>
          {type === "available" ? "Payment Initialized" : "Swap Request Created"}
        </h2>
        <p className="subtitle">
          Review the current swap progress and continue with the next step.
        </p>

        <div className="suggestion-box success-box">
          <h3>Status</h3>
          <div className="pnr-info">
            <p><strong>PNR:</strong> {pnrDetails?.pnrNumber}</p>
            <p><strong>Passenger:</strong> {selectedPassenger?.passengerName}</p>
            <p><strong>Current Seat:</strong> {selectedPassenger?.coachNumber}-{selectedPassenger?.seatNumber}</p>
            <p><strong>Target Seat:</strong> {selectedTargetSeat?.coachNumber}-{selectedTargetSeat?.seatNumber}</p>
            <p><strong>Swap Type:</strong> {type === "available" ? "Direct Swap" : "Request Swap"} </p>
            <p><strong>Amount:</strong> ₹{amount}</p>
          </div>
        </div>

        {type === "available" && (
          <div className="suggestion-box">
            <h3>Payment Order Response</h3>
            <pre className="swap-json-box">
              {JSON.stringify(paymentResponse, null, 2)}
            </pre>
          </div>
        )}

        {type === "booked" && (
          <>
            <div className="suggestion-box">
              <h3>Request Response</h3>
              <pre className="swap-json-box">
                {JSON.stringify(requestResponse, null, 2)}
              </pre>
            </div>

            <div className="suggestion-box">
              <h3>Booked Swap Payment Init</h3>
              <pre className="swap-json-box">
                {JSON.stringify(paymentInitResponse, null, 2)}
              </pre>
            </div>
          </>
        )}

        <div className="swap-action-row">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/swap-seat")}
          >
            Back to Swap Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapSeatResult;