import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Trains.css";
import { searchTrains } from "../Services/api";

import BackButton from "../components/BackButton";

const Trains = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    classType: "All Classes",
    quota: "GENERAL",
  });

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival || departure === "--" || arrival === "--") {
      return "--";
    }

    const [depHour, depMinute] = departure.split(":").map(Number);
    const [arrHour, arrMinute] = arrival.split(":").map(Number);

    let departureMinutes = depHour * 60 + depMinute;
    let arrivalMinutes = arrHour * 60 + arrMinute;

    if (arrivalMinutes < departureMinutes) {
      arrivalMinutes += 24 * 60;
    }

    const diff = arrivalMinutes - departureMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const loadTrains = async () => {
      const storedSearchData = localStorage.getItem("trainSearchData");
      let parsedSearchData = null;

      if (storedSearchData) {
        try {
          parsedSearchData = JSON.parse(storedSearchData);
          setSearchData(parsedSearchData);
        } catch (error) {
          console.error("Invalid search data:", error);
        }
      }

      const incomingTrains = location.state?.trains;

      if (incomingTrains && Array.isArray(incomingTrains)) {
        const mappedTrains = incomingTrains.map((train, index) => ({
          id: index + 1,
          trainNumber: train.trainNumber || "",
          trainName: train.trainName || "",
          fromStation: train.sourceStation || "",
          toStation: train.destinationStation || "",
          departureTime: train.departureTime || "--",
          arrivalTime: train.arrivalTime || "--",
          duration: calculateDuration(
            train.departureTime || "--",
            train.arrivalTime || "--"
          ),
          availableSeats: train.availableSeats ?? 50,
          fare: train.fare ?? 500,
          status: train.availableSeats === 0 ? "Waiting" : "Available",
        }));

        setTrains(mappedTrains);
        return;
      }

      if (parsedSearchData?.from && parsedSearchData?.to && parsedSearchData?.date) {
        try {
          setLoading(true);
          const data = await searchTrains(parsedSearchData);

          const mappedTrains = data.map((train, index) => ({
            id: index + 1,
            trainNumber: train.trainNumber || "",
            trainName: train.trainName || "",
            fromStation: train.sourceStation || parsedSearchData.from,
            toStation: train.destinationStation || parsedSearchData.to,
            departureTime: train.departureTime || "--",
            arrivalTime: train.arrivalTime || "--",
            duration: calculateDuration(
              train.departureTime || "--",
              train.arrivalTime || "--"
            ),
            availableSeats: train.availableSeats ?? 50,
            fare: train.fare ?? 500,
            status: train.availableSeats === 0 ? "Waiting" : "Available",
          }));

          setTrains(mappedTrains);
        } catch (error) {
          console.error("Failed to fetch trains:", error);
          setMessage("Failed to load trains");
        } finally {
          setLoading(false);
        }
      }
    };

    loadTrains();
  }, [location.state]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setMessage("");

      const payload = {
        from: searchData.from,
        to: searchData.to,
        date: searchData.date,
        classType: searchData.classType,
      };

      const data = await searchTrains(payload);

      const mappedTrains = data.map((train, index) => ({
        id: index + 1,
        trainNumber: train.trainNumber || "",
        trainName: train.trainName || "",
        fromStation: train.sourceStation || payload.from,
        toStation: train.destinationStation || payload.to,
        departureTime: train.departureTime || "--",
        arrivalTime: train.arrivalTime || "--",
        duration: calculateDuration(
          train.departureTime || "--",
          train.arrivalTime || "--"
        ),
        availableSeats: train.availableSeats ?? 50,
        fare: train.fare ?? 500,
        status: train.availableSeats === 0 ? "Waiting" : "Available",
      }));

      setTrains(mappedTrains);
      setMessage("Train list refreshed");
    } catch (error) {
      console.error("Refresh error:", error);
      setMessage("Failed to load trains");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (train) => {
    if (!train) return;

    const selectedTrain = {
      ...train,
      journeyDate: searchData.date,
    };

    localStorage.setItem("selectedTrain", JSON.stringify(selectedTrain));

    navigate("/seat-selection", {
  state: {
    train: {
      ...selectedTrain,
      journeyDate: searchData.date, // 🔥 ye line add
    },
  },
    });
  };

  const handleViewDetails = (train) => {
    setMessage(`${train.trainName} details feature will be added soon`);
  };

  const getStatusClass = (status) => {
    if (status === "Available") return "available";
    if (status === "Limited") return "limited";
    return "waiting";
  };

  return (
    <div className="trains-page">
      <div className="trains-header">
        <BackButton />
        <h2>Available Trains</h2>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="search-summary">
        <div className="summary-box">
          <p>
            <strong>From:</strong> {searchData.from}
          </p>
          <p>
            <strong>To:</strong> {searchData.to}
          </p>
          <p>
            <strong>Date:</strong> {searchData.date}
          </p>
          <p>
            <strong>Class:</strong> {searchData.classType}
          </p>
          <p>
            <strong>Quota:</strong> {searchData.quota}
          </p>
        </div>
      </div>

      {message && <p className="train-message">{message}</p>}

      <div className="train-list">
        {trains.length > 0 ? (
          trains.map((train) => (
            <div className="train-card" key={train.id}>
              <div className="train-top">
                <div>
                  <h3>
                    {train.trainName} <span>({train.trainNumber})</span>
                  </h3>
                  <p className="route-text">
                    {train.fromStation} → {train.toStation}
                  </p>
                </div>

                <div className={`train-status ${getStatusClass(train.status)}`}>
                  {train.status}
                </div>
              </div>

              <div className="train-middle">
                <div className="train-info-box">
                  <span>Departure</span>
                  <h4>{train.departureTime}</h4>
                </div>

                <div className="train-info-box">
                  <span>Duration</span>
                  <h4>{train.duration}</h4>
                </div>

                <div className="train-info-box">
                  <span>Arrival</span>
                  <h4>{train.arrivalTime}</h4>
                </div>

                <div className="train-info-box">
                  <span>Seats</span>
                  <h4>{train.availableSeats}</h4>
                </div>

                <div className="train-info-box">
                  <span>Fare</span>
                  <h4>₹{train.fare}</h4>
                </div>
              </div>

              <div className="train-bottom">
                <button
                  className="details-btn"
                  onClick={() => handleViewDetails(train)}
                >
                  View Details
                </button>

                <button
                  className="book-btn"
                  onClick={() => handleBookNow(train)}
                  disabled={train.availableSeats === 0}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-trains">
            <h3>No Trains Found</h3>
            <p>Please try another route or date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trains;