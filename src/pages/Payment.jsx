  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "../styles/Payment.css";
  import { createPaymentOrder, verifyPayment } from "../Services/api";

  import BackButton from "../components/BackButton";

  const Payment = () => {
    const navigate = useNavigate();

    const [bookingData, setBookingData] = useState(null);
    const [finalBooking, setFinalBooking] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        localStorage.setItem("redirectAfterLogin", "/payment");
        navigate("/login");
        return;
      }

      const storedBooking = localStorage.getItem("bookingData");
      const storedFinalBooking = localStorage.getItem("finalBooking");

      if (storedBooking) {
        try {
          const parsedBooking = JSON.parse(storedBooking);
          setBookingData(parsedBooking);
        } catch (error) {
          console.error("Invalid booking data:", error);
          setMessage("Booking data is invalid");
        }
      } else {
        setMessage("No booking data found");
      }

      if (storedFinalBooking) {
        try {
          const parsedFinalBooking = JSON.parse(storedFinalBooking);
          setFinalBooking(parsedFinalBooking);
        } catch (error) {
          console.error("Invalid final booking data:", error);
          setMessage("Final booking data is invalid");
        }
      }
    }, [navigate]);

    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const handlePayment = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        localStorage.setItem("redirectAfterLogin", "/payment");
        navigate("/login");
        return;
      }

      if (!bookingData) {
        setMessage("No booking data available for payment");
        return;
      }

      if (!finalBooking?.bookingId) {
        setMessage("Booking is not finalized. Please restart booking.");
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const sdkLoaded = await loadRazorpayScript();

        if (!sdkLoaded) {
          setMessage("Razorpay SDK failed to load");
          return;
        }

        const amount = Number(
          bookingData?.totalFare ||
            bookingData?.train?.fare ||
            bookingData?.fare ||
            0
        );

        if (!amount || amount <= 0) {
          setMessage("Invalid payment amount");
          return;
        }

        const payload = {
          bookingId: finalBooking.bookingId,
          userId: Number(userId),
          amount,
          paymentMethod,
        };

        console.log("Create order payload:", payload);

        const orderResponse = await createPaymentOrder(payload);
        console.log("Create order response:", orderResponse);

        if (!orderResponse?.gatewayOrderId || !orderResponse?.paymentId) {
          setMessage("Payment order response is invalid");
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_here",
          amount: Number(orderResponse.amount) * 100,
          currency: orderResponse.currency || "INR",
          name: "Train Ticket Booking",
          description: "Train Ticket Payment",
          order_id: orderResponse.gatewayOrderId,
          handler: async function (response) {
            try {
              await verifyPayment({
                paymentId: orderResponse.paymentId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              setMessage("Payment successful");

              localStorage.removeItem("bookingData");
              localStorage.removeItem("selectedTrain");
              localStorage.removeItem("selectedSeats");
              localStorage.removeItem("selectedCoach");
              localStorage.removeItem("draftId");

              setTimeout(() => {
                navigate(`/ticket/${finalBooking.pnrNumber}`);
              }, 1500);
            } catch (error) {
              console.error("Payment verify error:", error);
              setMessage(
                error?.response?.data?.message ||
                  error?.response?.data ||
                  "Payment verification failed"
              );
            }
          },
          prefill: {
            name: localStorage.getItem("userName") || "User",
          },
          notes: {
            bookingId: finalBooking.bookingId,
            pnrNumber: finalBooking.pnrNumber || "",
          },
          theme: {
            color: "#1f4b99",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setMessage("Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Payment error full:", error);
        console.log("Payment error response data:", error?.response?.data);
        console.log("Payment error status:", error?.response?.status);

        setMessage(
          error?.response?.data?.message ||
            error?.response?.data ||
            "Payment failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    const train = bookingData?.train || {};
    const passengers = bookingData?.passengers || [];
    const seats = bookingData?.seats || [];
    const coach = bookingData?.coach || "";
    const totalFare =
      bookingData?.totalFare || train?.fare || bookingData?.fare || 0;

    const passengerNames =
      passengers.length > 0
        ? passengers.map((p) => p.passengerName).join(", ")
        : "N/A";

    return (
      <div className="payment-page">
        <div className="payment-container">
          <BackButton />
          <h2>Payment Page</h2>

          {message && <p className="payment-message">{message}</p>}

          {!bookingData ? (
            <div className="payment-summary">
              <p>No booking data available</p>
            </div>
          ) : (
            <div className="payment-summary">
              <h3>Booking Summary</h3>

              <p>
                <strong>Train:</strong>{" "}
                {train?.trainName || "N/A"}{" "}
                {train?.trainNumber ? `(${train.trainNumber})` : ""}
              </p>

              <p>
                <strong>Passenger:</strong> {passengerNames}
              </p>

              <p>
                <strong>Route:</strong>{" "}
                {(train?.fromStation || "N/A")} → {(train?.toStation || "N/A")}
              </p>

              {coach && (
                <p>
                  <strong>Coach:</strong> {coach}
                </p>
              )}

              {seats.length > 0 && (
                <p>
                  <strong>Seats:</strong>{" "}
                  {seats
                    .map((seat) =>
                      typeof seat === "object"
                        ? `${seat.seatNumber || seat.id}${
                            seat.berth ? ` (${seat.berth})` : ""
                          }`
                        : seat
                    )
                    .join(", ")}
                </p>
              )}

              {finalBooking?.pnrNumber && (
                <p>
                  <strong>PNR:</strong> {finalBooking.pnrNumber}
                </p>
              )}

              <p>
                <strong>Fare:</strong> ₹{totalFare}
              </p>
            </div>
          )}

          <div className="payment-method-box">
            <h3>Select Payment Method</h3>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Debit / Credit Card
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="NetBanking"
                checked={paymentMethod === "NetBanking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Net Banking
            </label>
          </div>

          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={!bookingData || loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    );
  };

  export default Payment;