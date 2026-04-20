import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SeatSelection.css";

import BackButton from "../components/BackButton";
import {
  selectTrain,
  selectSeat,
  getCoachesByTrainId,
  getSeatsByTrainCoachAndDate,
} from "../Services/api";

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const train =
    location.state?.train ||
    JSON.parse(localStorage.getItem("selectedTrain")) ||
    null;

  const safeTrain = train || {};

  const journeyDate =
    safeTrain?.journeyDate ||
    localStorage.getItem("journeyDate") ||
    "";

  const [coachList, setCoachList] = useState([]);
  const [coachSeats, setCoachSeats] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState(localStorage.getItem("draftId") || "");

  const getTrainId = () => {
    return safeTrain?.trainId || safeTrain?.id || safeTrain?.train_id || 1;
  };

  const formatSeatType = (seatType) => {
    if (!seatType) return "LB";

    const type = seatType.toUpperCase();

    if (type === "LOWER") return "LB";
    if (type === "MIDDLE") return "MB";
    if (type === "UPPER") return "UB";
    if (type === "SIDE_LOWER") return "SL";
    if (type === "SIDE_UPPER") return "SU";

    return seatType;
  };

  const mapSeatsForUi = (coachName, seats) => {
    return seats.map((seat) => ({
      id: `${coachName}-${seat.seatNumber}`,
      seatId: seat.seatId, // ✅ actual DB seat_id
      seatNumber: seat.seatNumber,
      coach: coachName,
      berth: formatSeatType(seat.seatType),
      block: Math.ceil(seat.seatNumber / 8),
      side:
        seat.seatType === "SIDE_LOWER" || seat.seatType === "SIDE_UPPER",
      status: seat.status === "BOOKED" ? "booked" : "available",
    }));
  };

  useEffect(() => {
    if (train) {
      localStorage.setItem("selectedTrain", JSON.stringify(train));
      if (safeTrain?.journeyDate) {
        localStorage.setItem("journeyDate", safeTrain.journeyDate);
      }
    }
    loadSeatLayout();
  }, []);

  const loadSeatLayout = async () => {
    const trainId = getTrainId();

    if (!trainId) {
      setMessage("Train id not found. Please select train again.");
      return;
    }

    if (!journeyDate) {
      setMessage("Journey date not found. Please search train again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const coaches = await getCoachesByTrainId(trainId);

      if (!coaches || coaches.length === 0) {
        setCoachList([]);
        setCoachSeats([]);
        setSelectedCoach("");
        setMessage("No coaches found for this train.");
        return;
      }

      setCoachList(coaches);

      const defaultCoach = coaches[0];
      setSelectedCoach(defaultCoach);

      const seatData = await getSeatsByTrainCoachAndDate(
        trainId,
        defaultCoach,
        journeyDate
      );

      setCoachSeats(mapSeatsForUi(defaultCoach, seatData));
      setSelectedSeats([]);
    } catch (error) {
      console.error("Seat layout load error:", error);
      setMessage("Failed to load coach layout.");
    } finally {
      setLoading(false);
    }
  };

  const handleCoachChange = async (coachName) => {
    const trainId = getTrainId();

    setSelectedCoach(coachName);
    setSelectedSeats([]);
    setLoading(true);
    setMessage("");

    try {
      const seatData = await getSeatsByTrainCoachAndDate(
        trainId,
        coachName,
        journeyDate
      );
      setCoachSeats(mapSeatsForUi(coachName, seatData));
    } catch (error) {
      console.error("Coach seat load error:", error);
      setMessage("Failed to load seats for selected coach.");
    } finally {
      setLoading(false);
    }
  };

  const isSeatSelected = (seatUiId) => {
    return selectedSeats.some((seat) => seat.id === seatUiId);
  };

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return;

    if (isSeatSelected(seat.id)) {
      setSelectedSeats((prev) => prev.filter((item) => item.id !== seat.id));
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const calculateBaseFare = () => {
    return Number(
      safeTrain?.fare || safeTrain?.price || safeTrain?.ticketPrice || 450
    );
  };

  const calculateTotalFare = () => {
    return calculateBaseFare() * selectedSeats.length;
  };

  const handleProceedToNext = async () => {
    if (!train) {
      setMessage("Train data not found. Please go back and select a train again.");
      return;
    }

    if (selectedSeats.length === 0) {
      setMessage("Please select at least one berth.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let currentDraftId = draftId;

      if (!currentDraftId) {
        const trainPayload = {
          trainNumber: safeTrain?.trainNumber || "",
          trainName: safeTrain?.trainName || "",
          sourceStation: safeTrain?.fromStation || safeTrain?.from || "",
          destinationStation: safeTrain?.toStation || safeTrain?.to || "",
          departureTime: safeTrain?.departureTime || "",
          arrivalTime: safeTrain?.arrivalTime || "",
          journeyDate: safeTrain?.journeyDate || "",
          sourceType: safeTrain?.sourceType || "INTERNAL",
        };

        const trainResponse = await selectTrain(trainPayload);

        currentDraftId = trainResponse?.draftId || "";
        setDraftId(currentDraftId);
        localStorage.setItem("draftId", currentDraftId);
      }

      // ✅ backend ko actual seat_id bhejna hai, seat number nahi
      await selectSeat({
        draftId: currentDraftId,
        seatIds: selectedSeats.map((seat) => seat.seatId),
      });

      const bookingData = {
        draftId: currentDraftId,
        train: {
          trainId: getTrainId(),
          trainName: safeTrain?.trainName || "Selected Train",
          trainNumber: safeTrain?.trainNumber || "",
          fromStation: safeTrain?.fromStation || safeTrain?.from || "",
          toStation: safeTrain?.toStation || safeTrain?.to || "",
          fare: calculateBaseFare(),
          route: safeTrain?.route || "",
          departureTime: safeTrain?.departureTime || "",
          arrivalTime: safeTrain?.arrivalTime || "",
          journeyDate: safeTrain?.journeyDate || "",
        },
        coach: selectedCoach,
        seats: selectedSeats.map((seat) => ({
          id: seat.id,
          seatId: seat.seatId, // ✅ persist actual seat_id
          seatNumber: seat.seatNumber,
          coach: seat.coach,
          berth: seat.berth,
          block: seat.block,
        })),
        totalFare: calculateTotalFare(),
      };

      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      localStorage.setItem("selectedCoach", selectedCoach);
      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.setItem("redirectAfterLogin", "/passengers-details");
        navigate("/login");
        return;
      }

      navigate("/passengers-details", {
        state: {
          draftId: currentDraftId,
          train,
          selectedSeats,
          selectedCoach,
        },
      });
    } catch (error) {
      console.error("Proceed flow error:", error);
      setMessage("Unable to continue.");
    } finally {
      setLoading(false);
    }
  };

  const renderCoachBlocks = () => {
    if (!coachSeats || coachSeats.length === 0) return null;

    const blocks = [];
    const totalBlocks = Math.max(...coachSeats.map((seat) => seat.block), 0);

    for (let block = 1; block <= totalBlocks; block++) {
      const blockSeats = coachSeats.filter((seat) => seat.block === block);

      const mainBerths = blockSeats.filter((seat) => !seat.side).slice(0, 6);
      const sideBerths = blockSeats.filter((seat) => seat.side).slice(0, 2);

      blocks.push(
        <div className="coach-block" key={block}>
          <div className="block-index">Bay {block}</div>

          <div className="block-layout">
            <div className="main-berths">
              <BackButton />
              
              {mainBerths.map((seat) => (
                <div
                  key={seat.id}
                  className={`berth-card ${seat.status} ${
                    isSeatSelected(seat.id) ? "selected" : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                  title={`${seat.coach}-${seat.seatNumber} (${seat.berth})`}
                >
                  <span className="berth-number">{seat.seatNumber}</span>
                  <span className="berth-type">{seat.berth}</span>
                </div>
              ))}
            </div>

            <div className="walkway-space"></div>

            <div className="side-berths">
              {sideBerths.map((seat) => (
                <div
                  key={seat.id}
                  className={`berth-card side ${seat.status} ${
                    isSeatSelected(seat.id) ? "selected" : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                  title={`${seat.coach}-${seat.seatNumber} (${seat.berth})`}
                >
                  <span className="berth-number">{seat.seatNumber}</span>
                  <span className="berth-type">{seat.berth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return blocks;
  };

  return (
    <div className="seat-page">
      <div className="seat-container">
        <div className="seat-header">
          <div>
            <h2>Seat Selection</h2>
            <p>
              {train
                ? `${safeTrain?.trainName || "Selected Train"} ${
                    safeTrain?.trainNumber ? `(${safeTrain.trainNumber})` : ""
                  }`
                : "Select your sleeper berth"}
            </p>
            <p>Journey Date: {journeyDate || "Not selected"}</p>
          </div>

          <div className="coach-selector-box">
            <label>Select Coach</label>
            <select
              value={selectedCoach}
              onChange={(e) => handleCoachChange(e.target.value)}
              disabled={loading || coachList.length === 0}
            >
              {coachList.map((coach) => (
                <option key={coach} value={coach}>
                  {coach}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-box available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-box selected"></span>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-box booked"></span>
            <span>Booked</span>
          </div>
        </div>

        <div className="berth-guide">
          <span>LB = Lower Berth</span>
          <span>MB = Middle Berth</span>
          <span>UB = Upper Berth</span>
          <span>SL = Side Lower</span>
          <span>SU = Side Upper</span>
        </div>

        {message && <div className="seat-message">{message}</div>}

        {loading ? (
          <p className="loading-text">Loading sleeper coach layout...</p>
        ) : (
          <div className="coach-layout-wrapper">{renderCoachBlocks()}</div>
        )}

        <div className="selected-summary">
          <div className="summary-left">
            <h3>Selected Berths</h3>
            <p>
              {selectedSeats.length > 0
                ? selectedSeats
                    .map(
                      (seat) =>
                        `${seat.coach}-${seat.seatNumber} (${seat.berth})`
                    )
                    .join(", ")
                : "No berth selected"}
            </p>
          </div>

          <div className="summary-right">
            <h4>Total Fare</h4>
            <p>₹ {calculateTotalFare()}</p>
            <button
              className="proceed-btn"
              onClick={handleProceedToNext}
              disabled={selectedSeats.length === 0 || loading}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;