import React, { useState } from "react";
import "../styles/Alerts.css";

import BackButton from "../components/BackButton";

const Alerts = () => {
  const [activeTab, setActiveTab] = useState("ALERTS");

  const tabData = {
    ALERTS: [
      { text: "Booking and Cancellation for all site will not be available from 00:20 hrs to 03:45 hrs of 25/03/2026 due to maintenance activity. Inconvenience caused is deeply regretted.", color: "red" },
      { text: "Booking and Cancellation for Delhi site will not be available from 00:20 hrs to 04:45 hrs of 27/03/2026 due to maintenance activity. Inconvenience caused is deeply regretted.", color: "red" },
      { text: "Please visit Ticket Cancellation and Refund Rules under Refund Rules section for newly started Vande Bharat Sleeper Express and Amrit Bharat II Express trains.", color: "red" },
      { text: "With effect from 12 January 2026, only Aadhaar-authenticated users shall be allowed to book general reserved tickets on the opening day of Advance Reservation Period (ARP).", color: "red" },
      { text: "User registration, Updating of profile and ERS in pdf format will not be available from 07:30hrs to 12:00hrs.", color: "red" },
      { text: "Customer Care Numbers : Dial 14646 (Within India) (Language: Hindi, English, Punjabi, Bengali, Assamese, Odia, Marathi, Gujarati, Tamil, Telugu, Kannada and Malayalam); Customer Support (Outside India): Call: +91-8044647999 / +91-8035734999", color: "red" },
      { text: "Money debited but ticket not booked. Click here to know more.", color: "black" },
      { text: "Claim Process for trip delay on IRCTC Tejas Express (Train No: 82501/82502/82901/82902)", color: "blue" },
      { text: "PASSENGERS ARE REQUESTED TO CHECK THE DEPARTURE TIME OF THEIR TRAINS FROM INDIAN RAILWAY WEBSITE www.indianrail.gov.in , NTES OR 139 BEFORE BOARDING.", color: "red" },
      { text: "Railway Board Circular dated 16.11.2021 on Carrying valid proof of Identity by passengers during journey. Click here.", color: "blue" },
          ],

    UPDATES: [
      { text: "Latest railway system updates will be available here.", color: "blue" },
      { text: "Train timing and reservation policy changes will be shown in this section.", color: "red" },
    ],

    "GENERAL INFO": [
      { text: "General passenger information and reservation rules will be shown here.", color: "blue" },
      { text: "Please carry valid ID proof during journey.", color: "red" },
    ],

    "QUICK LINKS": [
      { text: "Quick booking and enquiry related information will be available here.", color: "blue" },
      { text: "Use official IRCTC channels only.", color: "red" },
    ],

    "RAILWAY UPDATES": [
      { text: "Special railway updates and announcements will be displayed here.", color: "blue" },
      { text: "Passengers should regularly check updated departure timings.", color: "red" },
    ],
  };

  return (
    <div className="alerts-page">
      <div className="alerts-tabs">
        <BackButton />
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="alerts-content">
        {tabData[activeTab].map((item, index) => (
          <div className="alert-row" key={index}>
            <span className="bullet">•</span>
            <p className={item.color}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;