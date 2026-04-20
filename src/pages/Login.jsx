import React, { useState } from "react";
import "../styles/Login.css";
import { loginUser } from "../Services/api";
import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    otpOption: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (event) => {
  event.preventDefault();

  const email = formData.email.trim();
  const password = formData.password.trim();

  if (!email && !password) {
    setMessage("Please enter email and password");
    return;
  }

  if (!email) {
    setMessage("Please enter email");
    return;
  }

  if (!password) {
    setMessage("Please enter password");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const data = await loginUser({
      email,
      password,
    });

    console.log("Login response:", data);

    if (!data?.token || !data?.userId) {
      throw new Error("Login response is incomplete");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", String(data.userId));

    if (data?.name) {
      localStorage.setItem("userName", data.name);
    } else if (data?.username) {
      localStorage.setItem("userName", data.username);
    } else {
      localStorage.setItem("userName", "User");
    }

    window.dispatchEvent(new Event("authChanged"));

    const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
    localStorage.removeItem("redirectAfterLogin");

    setMessage("Login successful");
    navigate(redirectPath);
  } catch (error) {
    console.error("Login error:", error);

    if (error.code === "ECONNABORTED") {
      setMessage("Server is taking too long to respond");
    } else if (error.response?.status === 401) {
      setMessage("Invalid email or password");
    } else if (error.response?.status === 403) {
      setMessage("Access denied");
    } else if (error.response?.status >= 500) {
      setMessage("Server error. Please try again");
    } else if (error.request && !error.response) {
      setMessage("Backend not reachable from this device/network");
    } else {
      setMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "Login failed. Please try again"
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <BackButton />
        <h2>LOGIN</h2>

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
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
            style={{ cursor: "pointer" }}
          >
            👁️
          </span>
        </div>

        <p className="forgot">FORGOT ACCOUNT DETAILS?</p>

        <label className="otp-option">
          <input
            type="checkbox"
            name="otpOption"
            checked={formData.otpOption}
            onChange={handleChange}
          />
          Visually impaired users may select this option to receive OTP instead
          of CAPTCHA
        </label>

        <button
          className="signin-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        {message && <p className="login-message">{message}</p>}

        <div className="bottom-btns">
          <button
            type="button"
            className="register"
            onClick={() => navigate("/signup")}
          >
            REGISTER
          </button>

          <button type="button" className="agent">
            AGENT LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;