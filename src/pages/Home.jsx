import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import trainBg from "../assets/train_bg.jpg";
import "../styles/Home.css";
import { searchTrains } from "../Services/api";

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    classType: "All Classes",
    quota: "GENERAL",
    flexible: false,
    disability: false,
    pass: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = async (event) => {
  event.preventDefault();

  if (!formData.from || !formData.to || !formData.date) {
    setMessage("Please fill From, To and Date");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const payload = {
      ...formData,
      from: formData.from.trim().toUpperCase(),
      to: formData.to.trim().toUpperCase(),
    };

    localStorage.setItem("trainSearchData", JSON.stringify(payload));

    const trains = await searchTrains(payload);

    navigate("/trains", {
      state: {
        trains,
        searchData: payload,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    setMessage("Unable to search trains");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `linear-gradient(rgba(18, 28, 52, 0.26), rgba(18, 28, 52, 0.18)), url(${trainBg})`,
      }}
    >
      <div className="home-overlay">
        <div className="booking-wrapper">
          <div className="tabs">
            <button type="button" className="tab-btn">
              PNR STATUS
            </button>
            <button type="button" className="tab-btn">
              CHARTS / VACANCY
            </button>
          </div>

          <form className="booking-card" onSubmit={handleSearch}>
            <h2>BOOK TICKET</h2>

            <div className="row two-col">
              <div className="field-box">
                <label>From</label>
                <input
                  type="text"
                  name="from"
                  placeholder="Enter Source Station"
                  value={formData.from}
                  onChange={handleChange}
                />
              </div>

              <div className="field-box">
                <label>To</label>
                <input
                  type="text"
                  name="to"
                  placeholder="Enter Destination Station"
                  value={formData.to}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row two-col">
              <div className="field-box">
                <label>Date of Journey</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="field-box">
                <label>Class</label>
                <select
                  name="classType"
                  value={formData.classType}
                  onChange={handleChange}
                >
                  <option>All Classes</option>
                  <option>Sleeper</option>
                  <option>AC 3 Tier</option>
                  <option>AC 2 Tier</option>
                  <option>Chair Car</option>
                </select>
              </div>
            </div>

            <div className="row one-col">
              <div className="field-box quota-box">
                <label>Quota</label>
                <select
                  name="quota"
                  value={formData.quota}
                  onChange={handleChange}
                >
                  <option>GENERAL</option>
                  <option>TATKAL</option>
                  <option>LADIES</option>
                  <option>LOWER BERTH</option>
                </select>
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="disability"
                  checked={formData.disability}
                  onChange={handleChange}
                />
                Person With Disability Concession
              </label>

              <label>
                <input
                  type="checkbox"
                  name="flexible"
                  checked={formData.flexible}
                  onChange={handleChange}
                />
                Flexible With Date
              </label>

              <label>
                <input
                  type="checkbox"
                  name="pass"
                  checked={formData.pass}
                  onChange={handleChange}
                />
                Railway Pass Concession
              </label>
            </div>

            {message && <p className="home-message">{message}</p>}

            <button className="search-btn" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search Trains"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;