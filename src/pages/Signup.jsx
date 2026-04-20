import React, { useState } from "react";
import "../styles/Signup.css";
import { signupUser } from "../Services/api";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
    countryCode: "+91 - India",
    captcha: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generatedCaptcha = "6DuQU";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = formData.username.trim();
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const mobile = formData.mobile.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();
    const captcha = formData.captcha.trim();

    if (
      !username ||
      !fullName ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword ||
      !captcha
    ) {
      setMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password and Confirm Password do not match");
      return;
    }

    if (captcha !== generatedCaptcha) {
      setMessage("Invalid captcha");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        username,
        fullName,
        email,
        mobile,
        password,
      };

      const data = await signupUser(payload);

      console.log("Signup response:", data);

      setMessage("Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Signup failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <BackButton />
        <div className="notice">
          <p>
            1. Garbage / Junk values in profile may lead to deactivation of
            IRCTC account.
          </p>
          <p>
            2. Opening Advance Reservation Period (ARP) ticket and Opening
            Tatkal ticket booking for unauthenticated users is allowed only
            after 4 days from date of User Registration.
          </p>
        </div>

        <input
          type="text"
          name="username"
          placeholder="User Name"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <div className="password-box">
          <input
            type={formData.showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                showPassword: !prev.showPassword,
              }))
            }
          >
            👁️
          </span>
        </div>

        <div className="password-box">
          <input
            type={formData.showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                showConfirmPassword: !prev.showConfirmPassword,
              }))
            }
          >
            👁️
          </span>
        </div>

        <div className="info">
          Invalid email ID may lead to deactivation of IRCTC account.
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="countryCode"
          value={formData.countryCode}
          onChange={handleChange}
        >
          <option>+91 - India</option>
        </select>

        <div className="info">
          Please submit Mobile Number without ISD Code
        </div>

        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <div className="captcha-box">
          <span className="captcha-text">{generatedCaptcha}</span>
          <button
            type="button"
            onClick={() => setMessage("Static captcha used for now")}
          >
            ⟳
          </button>
        </div>

        <input
          type="text"
          name="captcha"
          placeholder="Enter Captcha"
          value={formData.captcha}
          onChange={handleChange}
        />

        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;