import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/TicketPage.css";
import { getTicketByPnr } from "../Services/api";

import BackButton from "../components/BackButton";

const TicketPage = () => {
  const { pnrNumber } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await getTicketByPnr(pnrNumber);

        if (!data) {
          setMessage("Ticket not found");
          return;
        }

        setTicket(data);
      } catch (error) {
        console.error("Ticket fetch error:", error);
        setMessage(
          error?.response?.data?.message ||
            error?.response?.data ||
            "Failed to load ticket"
        );
      } finally {
        setLoading(false);
      }
    };

    if (pnrNumber) {
      fetchTicket();
    }
  }, [pnrNumber]);

  return (
    <div className="ticket-page">
      <div className="ticket-container">
        <BackButton />
        <h2>Your Ticket</h2>

        {loading && <p className="ticket-message">Loading ticket...</p>}
        {!loading && message && <p className="ticket-message error">{message}</p>}

        {!loading && ticket && (
          <div className="ticket-card">
            <div className="ticket-header">
              <h3>Train Ticket Confirmed</h3>
              <span className={`ticket-status ${ticket.status?.toLowerCase()}`}>
                {ticket.status}
              </span>
            </div>

            <div className="ticket-section">
              <p><strong>PNR Number:</strong> {ticket.pnrNumber}</p>
              <p><strong>Train:</strong> {ticket.trainName}</p>
              <p><strong>From:</strong> {ticket.source}</p>
              <p><strong>To:</strong> {ticket.destination}</p>
            </div>

            <div className="ticket-section">
              <h4>Passenger Details</h4>

              {ticket.passengers?.length > 0 ? (
                <div className="ticket-passenger-list">
                  {ticket.passengers.map((passenger, index) => (
                    <div className="ticket-passenger-card" key={index}>
                      <p><strong>Name:</strong> {passenger.name}</p>
                      <p><strong>Age:</strong> {passenger.age}</p>
                      <p><strong>Gender:</strong> {passenger.gender}</p>
                      <p><strong>Seat ID:</strong> {passenger.seatId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No passenger data available</p>
              )}
            </div>

            <div className="ticket-actions">
              <button onClick={() => window.print()}>Print Ticket</button>
              <button onClick={() => navigate("/")}>Go Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;