import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SwapSeat.css";

import BackButton from "../components/BackButton";
import {
  createBookedSwapPayment,
  completeBookedSwapPayment,
} from "../Services/api";

const SwapSeatTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const trackingData = location.state;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(
    trackingData?.requestResponse?.status || "EMAIL_SENT"
  );
  const [paymentInitResponse, setPaymentInitResponse] = useState(
    trackingData?.paymentInitResponse || null
  );

  if (!trackingData) {
    navigate("/swap-seat");
    return null;
  }

  const {
    pnrDetails,
    selectedPassenger,
    selectedTargetSeat,
    requestResponse,
    pricing,
    amount,
  } = trackingData;

  const swapId = requestResponse?.swapId;
  const totalAmount = amount || pricing?.total || 120;

  const statusMeta = useMemo(() => {
    switch ((status || "").toUpperCase()) {
      case "EMAIL_SENT":
        return {
          title: "Request Sent",
          description:
            "Swap request email has been sent to the passenger of the booked seat. Waiting for response.",
          typeClass: "info",
        };
      case "ACCEPTED":
        return {
          title: "Request Accepted",
          description:
            "The target passenger accepted your swap request. You can now proceed with payment.",
          typeClass: "success",
        };
      case "REJECTED":
        return {
          title: "Request Rejected",
          description:
            "The target passenger rejected your request. Please choose another seat.",
          typeClass: "error",
        };
      case "COMPLETED":
        return {
          title: "Swap Completed",
          description:
            "Booked seat swap has been completed successfully.",
          typeClass: "success",
        };
      case "EXPIRED":
        return {
          title: "Request Expired",
          description:
            "This swap request has expired. Please create a new request.",
          typeClass: "error",
        };
      default:
        return {
          title: "Waiting for Response",
          description:
            "Your request is under process. Please check again after some time.",
          typeClass: "info",
        };
    }
  }, [status]);

  const handleCheckStatusAndPay = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!swapId) {
        throw new Error("Swap ID not found");
      }

      const orderResponse = await createBookedSwapPayment(swapId);
      setPaymentInitResponse(orderResponse);
      setStatus("ACCEPTED");

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency || "INR",
        name: "Train Ticket Booking",
        description: "Booked Seat Swap Payment",
        order_id: orderResponse.orderId,
        handler: async function (response) {
          try {
            const successPayload = {
              swapId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            const completeResponse = await completeBookedSwapPayment(
              successPayload
            );

            navigate("/swap-seat/success", {
              state: {
                type: "booked",
                pnrDetails,
                selectedPassenger,
                selectedTargetSeat,
                pricing,
                amount: totalAmount,
                completeResponse,
              },
            });
          } catch (verifyError) {
            setMessage(
              verifyError?.response?.data?.message ||
                verifyError?.message ||
                "Payment completed but booked swap confirmation failed"
            );
          }
        },
        prefill: {
          name: selectedPassenger?.passengerName || "",
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
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to check status or create payment";

      setMessage(errorMessage);

      if (
        errorMessage.toLowerCase().includes("not accepted") ||
        errorMessage.toLowerCase().includes("swap not accepted yet")
      ) {
        setStatus("EMAIL_SENT");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChooseAnotherSeat = () => {
    navigate("/swap-seat/options", {
      state: {
        pnrDetails,
        selectedPassenger,
      },
    });
  };

  return (
    <div className="swap-page">
      <div className="swap-container swap-options-container">
        <div className="swap-options-header">
          <BackButton />
          <div>
            <h2>Swap Request Tracking</h2>
            <p className="subtitle">
              Track the status of your booked seat swap request and continue when accepted.
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

        {message && <p className="message">{message}</p>}

        <div className={`suggestion-box tracking-status-box ${statusMeta.typeClass}`}>
          <h3>{statusMeta.title}</h3>
          <p className="tracking-status-text">{statusMeta.description}</p>

          <div className="tracking-timeline">
            <div className={`tracking-step active-step`}>
              <span className="tracking-step-dot"></span>
              <div>
                <strong>Request Created</strong>
                <p>Swap request has been created successfully.</p>
              </div>
            </div>

            <div
              className={`tracking-step ${
                ["EMAIL_SENT", "ACCEPTED", "COMPLETED", "REJECTED", "EXPIRED"].includes(
                  (status || "").toUpperCase()
                )
                  ? "active-step"
                  : ""
              }`}
            >
              <span className="tracking-step-dot"></span>
              <div>
                <strong>Email Sent</strong>
                <p>Notification has been sent to the target passenger.</p>
              </div>
            </div>

            <div
              className={`tracking-step ${
                ["ACCEPTED", "COMPLETED"].includes((status || "").toUpperCase())
                  ? "active-step"
                  : ""
              }`}
            >
              <span className="tracking-step-dot"></span>
              <div>
                <strong>Accepted</strong>
                <p>Target passenger accepted the request.</p>
              </div>
            </div>

            <div
              className={`tracking-step ${
                (status || "").toUpperCase() === "COMPLETED" ? "active-step" : ""
              }`}
            >
              <span className="tracking-step-dot"></span>
              <div>
                <strong>Payment & Swap Completed</strong>
                <p>Payment successful and booked seat swap completed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="swap-seat-compare-grid">
          <div className="suggestion-box">
            <h3>Request Summary</h3>
            <div className="pnr-info">
              <p>
                <strong>Swap ID:</strong> {swapId || "N/A"}
              </p>
              <p>
                <strong>PNR:</strong> {pnrDetails?.pnrNumber || "N/A"}
              </p>
              <p>
                <strong>Passenger:</strong>{" "}
                {selectedPassenger?.passengerName || "N/A"}
              </p>
              <p>
                <strong>Journey Date:</strong> {pnrDetails?.journeyDate || "N/A"}
              </p>
              <p>
                <strong>Train:</strong> {pnrDetails?.trainName || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {status || "EMAIL_SENT"}
              </p>
              <p>
                <strong>Source:</strong> {pnrDetails?.source || "N/A"}
              </p>
              <p>
                <strong>Destination:</strong> {pnrDetails?.destination || "N/A"}
              </p>
            </div>
          </div>

          <div className="suggestion-box">
            <h3>Requested Seat</h3>
            <div className="pnr-info">
              <p>
                <strong>Current Seat:</strong>{" "}
                {selectedPassenger?.coachNumber}-{selectedPassenger?.seatNumber}
              </p>
              <p>
                <strong>Requested Seat:</strong>{" "}
                {selectedTargetSeat?.coachNumber}-{selectedTargetSeat?.seatNumber}
              </p>
              <p>
                <strong>Current Seat ID:</strong> {selectedPassenger?.seatId}
              </p>
              <p>
                <strong>Target Seat ID:</strong> {selectedTargetSeat?.seatId}
              </p>
              <p>
                <strong>Current Seat Type:</strong>{" "}
                {selectedPassenger?.seatType || "N/A"}
              </p>
              <p>
                <strong>Target Seat Type:</strong>{" "}
                {selectedTargetSeat?.seatType || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="suggestion-box swap-charge-box">
          <h3>Payment Summary</h3>

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
              <span>Total payable</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {paymentInitResponse && (
            <div className="tracking-payment-note">
              Payment order is ready. Proceed to complete the booked seat swap.
            </div>
          )}

          <div className="swap-action-row">
            {(status || "").toUpperCase() === "REJECTED" ||
            (status || "").toUpperCase() === "EXPIRED" ? (
              <button
                type="button"
                className="select-passenger-btn"
                onClick={handleChooseAnotherSeat}
              >
                Choose Another Seat
              </button>
            ) : (
              <button
                type="button"
                className="select-passenger-btn"
                onClick={handleCheckStatusAndPay}
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Status / Pay Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapSeatTracking;