import React, { useState } from "react";
import "../styles/OtherServices.css";

import BackButton from "../components/BackButton";

const OtherServices = () => {
  const [selectedService, setSelectedService] = useState("ipay");
  const [showHolidaySub, setShowHolidaySub] = useState(false);
  const [showPromoSub, setShowPromoSub] = useState(false);

  const serviceContent = {
    ipay: {
      title: "IRCTC iPAY",
      subtitle: "Secure and fast payment gateway for railway bookings.",
      cards: [
        { heading: "Fast Checkout", text: "Quick payment flow for ticket booking and cancellations." },
        { heading: "Secure Payments", text: "Protected transactions with trusted payment processing." },
        { heading: "Multiple Options", text: "UPI, cards, net banking and wallet support." }
      ]
    },
    buses: {
      title: "Bus Booking",
      subtitle: "Book intercity and regional buses with ease.",
      cards: [
        { heading: "Seat Selection", text: "Choose preferred seats before payment." },
        { heading: "Route Search", text: "Search buses by city, date and timing." },
        { heading: "Live Availability", text: "Check available buses instantly." }
      ]
    },
    flights: {
      title: "Flight Services",
      subtitle: "Search and compare domestic and international flights.",
      cards: [
        { heading: "Flight Search", text: "Find flights by source, destination and travel date." },
        { heading: "Fare Compare", text: "Compare pricing from different options." },
        { heading: "Travel Details", text: "Easy view of departure, arrival and baggage info." }
      ]
    },
    hotels: {
      title: "Hotel Booking",
      subtitle: "Find stays near railway stations and tourist spots.",
      cards: [
        { heading: "Room Booking", text: "Book standard and premium rooms quickly." },
        { heading: "Nearby Hotels", text: "See hotel options near your destination." },
        { heading: "Easy Planning", text: "Combine train and stay planning in one place." }
      ]
    },
    holidays: {
      title: "Holiday Packages",
      subtitle: "Explore railway tourism and vacation packages.",
      cards: [
        { heading: "Tour Packages", text: "Pre-planned trips for families, students and groups." },
        { heading: "Pilgrimage Tours", text: "Special spiritual and temple visit packages." },
        { heading: "Luxury Trains", text: "Premium tourism experiences with luxury train travel." }
      ]
    },
    wheelchair: {
      title: "e-Wheelchair",
      subtitle: "Passenger assistance service for station support.",
      cards: [
        { heading: "Station Assistance", text: "Wheelchair booking support for passengers in need." },
        { heading: "Easy Request", text: "Simple request system before journey." },
        { heading: "Travel Comfort", text: "Helps improve convenience for senior citizens and others." }
      ]
    },
    promotions: {
      title: "Promotions & Offers",
      subtitle: "Special deals and discounts for travel-related services.",
      cards: [
        { heading: "Offers", text: "Seasonal cashback and coupon-based offers." },
        { heading: "Discount Deals", text: "Discounts on partner services and bookings." },
        { heading: "Travel Benefits", text: "Promotional support across hotels, buses and meals." }
      ]
    }
  };

  const current = serviceContent[selectedService];

  return (
    <div className="services-page">
      <div className="services-box">
        <BackButton />
        <div
          className={`service-item bold ${selectedService === "ipay" ? "active" : ""}`}
          onClick={() => setSelectedService("ipay")}
        >
          IRCTC-iPAY
        </div>

        <div
          className={`service-item ${selectedService === "buses" ? "active" : ""}`}
          onClick={() => setSelectedService("buses")}
        >
          Buses
        </div>

        <div
          className={`service-item ${selectedService === "flights" ? "active" : ""}`}
          onClick={() => setSelectedService("flights")}
        >
          Flights
        </div>

        <div
          className={`service-item ${selectedService === "hotels" ? "active" : ""}`}
          onClick={() => setSelectedService("hotels")}
        >
          Hotels
        </div>

        <div
          className={`service-item submenu-parent ${selectedService === "holidays" ? "active" : ""}`}
          onMouseEnter={() => setShowHolidaySub(true)}
          onMouseLeave={() => setShowHolidaySub(false)}
          onClick={() => setSelectedService("holidays")}
        >
          Holidays <span className="arrow">▶</span>

          {showHolidaySub && (
            <div className="submenu">
              <div className="submenu-item" onClick={() => setSelectedService("holidays")}>
                Tour Packages
              </div>
              <div className="submenu-item" onClick={() => setSelectedService("holidays")}>
                Pilgrimage Tours
              </div>
              <div className="submenu-item" onClick={() => setSelectedService("holidays")}>
                Luxury Trains
              </div>
            </div>
          )}
        </div>

        <div
          className={`service-item ${selectedService === "wheelchair" ? "active" : ""}`}
          onClick={() => setSelectedService("wheelchair")}
        >
          e-Wheelchair
        </div>

        <div
          className={`service-item submenu-parent ${selectedService === "promotions" ? "active" : ""}`}
          onMouseEnter={() => setShowPromoSub(true)}
          onMouseLeave={() => setShowPromoSub(false)}
          onClick={() => setSelectedService("promotions")}
        >
          Promotions <span className="arrow">▶</span>

          {showPromoSub && (
            <div className="submenu">
              <div className="submenu-item" onClick={() => setSelectedService("promotions")}>
                Offers
              </div>
              <div className="submenu-item" onClick={() => setSelectedService("promotions")}>
                Discount Deals
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="services-content">
        <div className="services-header">
          <h2>{current.title}</h2>
          <p>{current.subtitle}</p>
        </div>

        <div className="services-grid">
          {current.cards.map((card, index) => (
            <div className="service-card" key={index}>
              <h3>{card.heading}</h3>
              <p>{card.text}</p>
              <button>Explore</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherServices;