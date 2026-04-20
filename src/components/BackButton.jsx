import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-btn-global" onClick={handleBack}>
       {label}
    </button>
  );
};

export default BackButton;