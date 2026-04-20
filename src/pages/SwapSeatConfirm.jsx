import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SwapSeat.css";

import BackButton from "../components/BackButton";
import {
  createSwapRequest,
  createAvailableSwapPayment,
  completeAvailableSwapPayment,
  createBookedSwapPayment,
} from "../Services/api";

const SwapSeatConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pnrDetails = location.state?.pnrDetails;
  const selectedPassenger = location.state?.selectedPassenger;
  const selectedTargetSeat = location.state?.selectedTargetSeat;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!pnrDetails || !selectedPassenger || !selectedTargetSeat) {
    navigate("/swap-seat");
    return null;
  }

  const isAvailableSwap = selectedTargetSeat.status === "AVAILABLE";
  const isBookedSwap = selectedTargetSeat.status === "BOOKED";

  const pricing = useMemo(() => {
    if (isAvailableSwap) {
      return {
        baseFare: 49,
        platformFee: 15,
        gst: 11,
        total: 75,
      };
    }

    if (isBookedSwap) {
      return {
        baseFare: 79,
        platformFee: 21,
        gst: 20,
        total: 120,
      };
    }

    return {
      baseFare: 0,
      platformFee: 0,
      gst: 0,
      total: 0,
    };
  }, [isAvailableSwap, isBookedSwap]);

  const handleAvailableSwapPayment = async () => {
    const payload = {
      requesterBookingId: pnrDetails.bookingId,
      requesterPassengerId: selectedPassenger.passengerId,
      requesterCurrentSeatId: selectedPassenger.seatId,
      targetSeatId: selectedTargetSeat.seatId,
    };

    const orderResponse = await createAvailableSwapPayment(payload);

    if (!window.Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    const options = {
      key: orderResponse.key,
      amount: orderResponse.amount,
      currency: orderResponse.currency || "INR",
      name: "Train Ticket Booking",
      description: "Available Seat Swap Payment",
      order_id: orderResponse.orderId,
      handler: async function () {
        try {
          const completeResponse = await completeAvailableSwapPayment(payload);

          navigate("/swap-seat/success", {
            state: {
              type: "available",
              pnrDetails,
              selectedPassenger,
              selectedTargetSeat,
              pricing,
              amount: pricing.total,
              completeResponse,
            },
          });
        } catch (verifyError) {
          setMessage(
            verifyError?.response?.data?.message ||
              verifyError?.message ||
              "Payment completed but swap confirmation failed"
          );
        }
      },
      prefill: {
        name: selectedPassenger.passengerName || "",
      },
      theme: {
        color: "#1f5fbf",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setMessage("Payment popup closed.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleBookedSwapRequest = async () => {
    const requestPayload = {
      requesterBookingId: pnrDetails.bookingId,
      requesterPassengerId: selectedPassenger.passengerId,
      requesterCurrentSeatId: selectedPassenger.seatId,
      targetSeatId: selectedTargetSeat.seatId,
    };

    const requestResponse = await createSwapRequest(requestPayload);

    let paymentInitResponse = null;

    if (requestResponse?.swapId) {
      try {
        paymentInitResponse = await createBookedSwapPayment(requestResponse.swapId);
      } catch (error) {
        paymentInitResponse = null;
      }
    }

    navigate("/swap-seat/tracking", {
      state: {
        type: "booked",
        pnrDetails,
        selectedPassenger,
        selectedTargetSeat,
        requestResponse,
        paymentInitResponse,
        amount: pricing.total,
        pricing,
      },
    });
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (isAvailableSwap) {
        await handleAvailableSwapPayment();
        return;
      }

      if (isBookedSwap) {
        await handleBookedSwapRequest();
        return;
      }

      setMessage("Invalid seat type selected.");
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to continue swap flow"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swap-page">
      <div className="swap-container swap-options-container">
        <BackButton />
        <div className="swap-options-header">
          <div>
            <h2>Confirm Seat Swap</h2>
            <p className="subtitle">
              Review the current seat and target seat before continuing.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/swap-seat/options", { state: location.state })
            }
          >
            Back to Seat Selection
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="swap-confirm-layout">
          <div className="suggestion-box">
            <h3>Passenger Details</h3>
            <div className="pnr-info">
              <p>
                <strong>Passenger:</strong> {selectedPassenger.passengerName}
              </p>
              <p>
                <strong>Age:</strong> {selectedPassenger.age || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {selectedPassenger.gender || "N/A"}
              </p>
              <p>
                <strong>PNR:</strong> {pnrDetails.pnrNumber}
              </p>
              <p>
                <strong>Train:</strong> {pnrDetails.trainName || "N/A"}
              </p>
              <p>
                <strong>Journey Date:</strong> {pnrDetails.journeyDate}
              </p>
              <p>
                <strong>Source:</strong> {pnrDetails.source || "N/A"}
              </p>
              <p>
                <strong>Destination:</strong> {pnrDetails.destination || "N/A"}
              </p>
            </div>
          </div>

          <div className="swap-seat-compare-grid">
            <div className="suggestion-box current-seat-card">
              <h3>Current Seat</h3>
              <div className="pnr-info">
                <p>
                  <strong>Coach:</strong> {selectedPassenger.coachNumber}
                </p>
                <p>
                  <strong>Seat ID:</strong> {selectedPassenger.seatId}
                </p>
                <p>
                  <strong>Seat Number:</strong> {selectedPassenger.seatNumber}
                </p>
                <p>
                  <strong>Seat Type:</strong>{" "}
                  {selectedPassenger.seatType || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedPassenger.seatStatus || "BOOKED"}
                </p>
              </div>
            </div>

            <div className="suggestion-box target-seat-card">
              <h3>Target Seat</h3>
              <div className="pnr-info">
                <p>
                  <strong>Coach:</strong> {selectedTargetSeat.coachNumber}
                </p>
                <p>
                  <strong>Seat ID:</strong> {selectedTargetSeat.seatId}
                </p>
                <p>
                  <strong>Seat Number:</strong> {selectedTargetSeat.seatNumber}
                </p>
                <p>
                  <strong>Seat Type:</strong>{" "}
                  {selectedTargetSeat.seatType || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTargetSeat.status}
                </p>
                <p>
                  <strong>Swap Mode:</strong>{" "}
                  {isAvailableSwap ? "Direct Swap" : "Request Swap"}
                </p>
              </div>
            </div>
          </div>

          <div className="suggestion-box swap-charge-box">
            <h3>Payment Summary</h3>

            <div className="swap-pricing-card">
              <div className="swap-pricing-row">
                <span>Swap base charge</span>
                <span>₹{pricing.baseFare}</span>
              </div>

              <div className="swap-pricing-row">
                <span>Platform fee</span>
                <span>₹{pricing.platformFee}</span>
              </div>

              <div className="swap-pricing-row">
                <span>GST</span>
                <span>₹{pricing.gst}</span>
              </div>

              <div className="swap-pricing-divider"></div>

              <div className="swap-pricing-row swap-pricing-total">
                <span>Total payable</span>
                <span>₹{pricing.total}</span>
              </div>
            </div>

            <div className="swap-next-step-note">
              <p>
                <strong>Swap Type:</strong>{" "}
                {isAvailableSwap
                  ? "Available Seat Swap"
                  : "Booked Seat Swap"}
              </p>
              <p>
                <strong>Next Step:</strong>{" "}
                {isAvailableSwap
                  ? "Click proceed to open Razorpay and confirm direct swap."
                  : "Click send request to create request and continue booked-seat flow."}
              </p>
            </div>

            <div className="swap-action-row">
              <button
                type="button"
                className="back-btn"
                onClick={() =>
                  navigate("/swap-seat/options", { state: location.state })
                }
                disabled={loading}
              >
                Change Seat
              </button>

              <button
                type="button"
                className="select-passenger-btn"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isAvailableSwap
                  ? "Proceed to Payment"
                  : "Send Swap Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapSeatConfirm;