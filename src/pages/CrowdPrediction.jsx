import React, { useState } from "react";
import "../styles/CrowdPrediction.css";

import BackButton from "../components/BackButton";

const CrowdPrediction = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const [last20DaysData, setLast20DaysData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLast20DaysData = (baseScore) => {
    const data = [];

    for (let i = 20; i >= 1; i--) {
      const variation = Math.floor(Math.random() * 11) - 5; // -5 to +5
      let crowd = baseScore + variation;

      if (crowd > 100) crowd = 100;
      if (crowd < 35) crowd = 35;

      data.push({
        day: `Day - ${i}`,
        crowd,
      });
    }

    return data;
  };

  const calculatePrediction = (data) => {
    const total = data.reduce((sum, item) => sum + item.crowd, 0);
    const average = Math.round(total / data.length);

    const peakDays = data.filter((item) => item.crowd >= 80).length;
    const lowDays = data.filter((item) => item.crowd < 60).length;
    const highest = Math.max(...data.map((item) => item.crowd));
    const lowest = Math.min(...data.map((item) => item.crowd));

    let level = "";
    let colorClass = "";
    let recommendation = "";

    if (average >= 80) {
      level = "High Crowd";
      colorClass = "high";
      recommendation = "Heavy rush expected. Book early and prefer confirmed quota.";
    } else if (average >= 60) {
      level = "Medium Crowd";
      colorClass = "medium";
      recommendation = "Moderate crowd expected. Seat availability may reduce closer to departure.";
    } else {
      level = "Low Crowd";
      colorClass = "low";
      recommendation = "Lower crowd expected. Better chance of smoother booking.";
    }

    return {
      average,
      level,
      colorClass,
      peakDays,
      lowDays,
      highest,
      lowest,
      recommendation,
    };
  };

  const getBaseScoreFromTrain = (trainNo) => {
    const digits = trainNo.replace(/\D/g, "");

    if (!digits) return 65;

    const lastDigit = Number(digits[digits.length - 1]);

    if ([0, 1, 2].includes(lastDigit)) return 82;
    if ([3, 4, 5].includes(lastDigit)) return 68;
    return 54;
  };

  const handlePredict = async () => {
    if (!trainNumber.trim() && !journeyDate) {
      setMessage("Please enter train number and select journey date");
      setPredictionResult(null);
      setLast20DaysData([]);
      return;
    }

    if (!trainNumber.trim()) {
      setMessage("Please enter train number");
      setPredictionResult(null);
      setLast20DaysData([]);
      return;
    }

    if (!journeyDate) {
      setMessage("Please select journey date");
      setPredictionResult(null);
      setLast20DaysData([]);
      return;
    }

    setLoading(true);
    setMessage("");
    setPredictionResult(null);
    setLast20DaysData([]);

    try {
      // =========================
      // FUTURE API CALL PLACE
      // =========================
      // Example:
      // const response = await fetch("");
      // const data = await response.json();
      // setLast20DaysData(data.history);
      // setPredictionResult(data.prediction);

      const baseScore = getBaseScoreFromTrain(trainNumber);
      const generatedData = generateLast20DaysData(baseScore);
      const prediction = calculatePrediction(generatedData);

      setLast20DaysData(generatedData);
      setPredictionResult(prediction);
    } catch (error) {
      console.error("Crowd prediction error:", error);
      setMessage("Failed to predict crowd. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crowd-page">
      <div className="crowd-container">
        <BackButton />
        <h2 className="crowd-title">Crowd Prediction</h2>
        <p className="crowd-subtitle">
          Predict expected crowd based on train number and last 20 days trend
        </p>

        <div className="crowd-form">
          <div className="field-box">
            <label>Train Number</label>
            <input
              type="text"
              placeholder="Enter Train Number"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
            />
          </div>

          <div className="field-box">
            <label>Date of Journey</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
            />
          </div>

          <button className="predict-btn" onClick={handlePredict} disabled={loading}>
            {loading ? "Predicting..." : "Predict Crowd"}
          </button>
        </div>

        {message && <p className="crowd-message error">{message}</p>}

        {predictionResult && (
          <div className="prediction-result">
            <h3>Prediction Result</h3>

            <div className={`crowd-level ${predictionResult.colorClass}`}>
              {predictionResult.level}
            </div>

            <div className="prediction-grid">
              <div className="prediction-card">
                <h4>Expected Crowd Score</h4>
                <p>{predictionResult.average}%</p>
              </div>

              <div className="prediction-card">
                <h4>Highest in 20 Days</h4>
                <p>{predictionResult.highest}%</p>
              </div>

              <div className="prediction-card">
                <h4>Lowest in 20 Days</h4>
                <p>{predictionResult.lowest}%</p>
              </div>

              <div className="prediction-card">
                <h4>Peak Crowd Days</h4>
                <p>{predictionResult.peakDays}</p>
              </div>

              <div className="prediction-card">
                <h4>Low Crowd Days</h4>
                <p>{predictionResult.lowDays}</p>
              </div>

              <div className="prediction-card">
                <h4>Journey Date</h4>
                <p>{journeyDate}</p>
              </div>
            </div>

            <p className="prediction-note">
              {predictionResult.recommendation}
            </p>
          </div>
        )}

        {last20DaysData.length > 0 && (
          <div className="history-box">
            <h3>Last 20 Days Crowd Trend</h3>

            <div className="history-grid">
              {last20DaysData.map((item, index) => (
                <div className="history-card" key={index}>
                  <span>{item.day}</span>
                  <strong>{item.crowd}%</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrowdPrediction;