import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [showTrainsDropdown, setShowTrainsDropdown] = useState(false);
  const [showMealsDropdown, setShowMealsDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const isTrainsPage =
    location.pathname === "/trains" ||
    location.pathname === "/foreign-tourist-booking" ||
    location.pathname === "/connecting-journey-booking" ||
    location.pathname === "/pnr-enquiry" ||
    location.pathname === "/train-schedule" ||
    location.pathname === "/track-train";

  const isMealsPage =
    location.pathname === "/meals" ||
    location.pathname === "/book-food-e-pantry" ||
    location.pathname === "/order-food-e-catering" ||
    location.pathname === "/cooked-food-menu";

  const isServicesPage =
    location.pathname === "/other-services" ||
    location.pathname === "/tour-packages" ||
    location.pathname === "/pilgrimage-tours" ||
    location.pathname === "/luxury-trains" ||
    location.pathname === "/offers" ||
    location.pathname === "/discount-deals";

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const storedUserName = localStorage.getItem("userName");

      const validToken =
        token && token !== "undefined" && token !== "null" && token.trim() !== "";
      const validUserId =
        userId && userId !== "undefined" && userId !== "null" && userId.trim() !== "";

      if (validToken && validUserId) {
        setIsLoggedIn(true);
        setUserName(storedUserName || "User");
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("authChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("authChanged", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("draftId");
    localStorage.removeItem("selectedTrain");
    localStorage.removeItem("bookingData");
    localStorage.removeItem("finalBooking");
    localStorage.removeItem("redirectAfterLogin");

    setIsLoggedIn(false);
    setUserName("");

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        <NavLink to="/" className="nav-item">
          HOME
        </NavLink>

        <div className="navbar-menu">
          <div
            className="nav-item dropdown-parent"
            onMouseEnter={() => {
              if (!isTrainsPage) setShowTrainsDropdown(true);
            }}
            onMouseLeave={() => setShowTrainsDropdown(false)}
          >
            <NavLink
              to="/trains"
              className={({ isActive }) =>
                isActive ? "nav-item active nav-trigger" : "nav-item nav-trigger"
              }
            >
              TRAINS
            </NavLink>

            {!isTrainsPage && showTrainsDropdown && (
              <div className="dropdown-menu">
                <Link to="/trains">Book Ticket</Link>
                <Link to="/foreign-tourist-booking">Foreign Tourist Booking</Link>
                <Link to="/connecting-journey-booking">
                  Connecting Journey Booking
                </Link>
                <Link to="/pnr-enquiry">PNR Enquiry</Link>
                <Link to="/train-schedule">Train Schedule</Link>
                <Link to="/track-train">Track Train</Link>
              </div>
            )}
          </div>

          <div
            className="nav-item dropdown-parent"
            onMouseEnter={() => {
              if (!isMealsPage) setShowMealsDropdown(true);
            }}
            onMouseLeave={() => setShowMealsDropdown(false)}
          >
            <NavLink
              to="/meals"
              className={({ isActive }) =>
                isActive ? "nav-item active nav-trigger" : "nav-item nav-trigger"
              }
            >
              MEALS
            </NavLink>

            {!isMealsPage && showMealsDropdown && (
              <div className="dropdown-menu small-dropdown">
                <Link to="/book-food-e-pantry">Book Food – E-Pantry</Link>
                <Link to="/order-food-e-catering">Order Food - E-Catering</Link>
                <Link to="/cooked-food-menu">Cooked Food Menu</Link>
              </div>
            )}
          </div>

          <NavLink to="/alerts" className="nav-item">
            ALERTS
          </NavLink>

          <div
            className="nav-item dropdown-parent"
            onMouseEnter={() => {
              if (!isServicesPage) setShowServicesDropdown(true);
            }}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <NavLink
              to="/other-services"
              className={({ isActive }) =>
                isActive ? "nav-item active nav-trigger" : "nav-item nav-trigger"
              }
            >
              SERVICES
            </NavLink>

            {!isServicesPage && showServicesDropdown && (
              <div className="dropdown-menu small-dropdown">
                <Link to="/other-services">IRCTC-iPAY</Link>
                <Link to="/tour-packages">Tour Packages</Link>
                <Link to="/pilgrimage-tours">Pilgrimage Tours</Link>
                <Link to="/luxury-trains">Luxury Trains</Link>
                <Link to="/offers">Offers</Link>
                <Link to="/discount-deals">Discount Deals</Link>
              </div>
            )}
          </div>

          
          <NavLink to="/swap-seat" className="nav-item">
            SWAP SEAT
          </NavLink>

          <NavLink to="/contact-service" className="nav-item">
            CONTACT
          </NavLink>

          {!isLoggedIn ? (
            <Link to="/login" className="nav-item login-btn">
              LOGIN/REGISTER
            </Link>
          ) : (
            <>
              <span className="nav-item user-text">
                Welcome{userName ? `, ${userName}` : ""}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                LOGOUT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;