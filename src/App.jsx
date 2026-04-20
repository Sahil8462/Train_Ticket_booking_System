import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Trains from "./pages/Trains";
import Meals from "./pages/Meals";
import Alerts from "./pages/Alerts";
import OtherServices from "./pages/OtherServices";
import ContactService from "./pages/ContactService";
import CrowdPrediction from "./pages/CrowdPrediction";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import SwapSeat from "./pages/SwapSeat";
import SeatSelection from "./pages/SeatSelection";
import PassengersDetails from "./pages/PassengersDetails";
import TicketPage from "./pages/TicketPage";
import SwapSeatOptions from "./pages/SwapSeatOptions";
import SwapSeatConfirm from "./pages/SwapSeatConfirm";
import SwapSeatResult from "./pages/SwapSeatResult";
import SwapSeatSuccess from "./pages/SwapSeatSuccess";
import SwapSeatTracking from "./pages/SwapSeatTracking";

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trains" element={<Trains />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/other-services" element={<OtherServices />} />
        <Route path="/contact-service" element={<ContactService />} />
        <Route path="/crowd-prediction" element={<CrowdPrediction />} />
        <Route path="/swap-seat" element={<SwapSeat />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />

        <Route path="/foreign-tourist-booking" element={<Trains />} />
        <Route path="/connecting-journey-booking" element={<Trains />} />
        <Route path="/special-trains" element={<Trains />} />
        <Route path="/premium-trains" element={<Trains />} />
        <Route path="/holiday-specials" element={<Trains />} />
        <Route path="/cancel-eticket" element={<Trains />} />
        <Route path="/pnr-enquiry" element={<Trains />} />
        <Route path="/train-schedule" element={<Trains />} />
        <Route path="/track-train" element={<Trains />} />
        <Route path="/ftr-booking" element={<Trains />} />
        <Route path="/dogs-cats-booking" element={<Trains />} />
        <Route path="/link-aadhaar" element={<Trains />} />
        <Route path="/counter-ticket-cancellation" element={<Trains />} />
        <Route path="/boarding-point-change" element={<Trains />} />
        <Route path="/android-app" element={<Trains />} />
        <Route path="/ios-app" element={<Trains />} />
        <Route path="/loyalty" element={<Trains />} />
        <Route path="/ewallet" element={<Trains />} />

        <Route path="/book-food-e-pantry" element={<Meals />} />
        <Route path="/order-food-e-catering" element={<Meals />} />
        <Route path="/cooked-food-menu" element={<Meals />} />

        <Route path="/tour-packages" element={<OtherServices />} />
        <Route path="/pilgrimage-tours" element={<OtherServices />} />
        <Route path="/luxury-trains" element={<OtherServices />} />
        <Route path="/offers" element={<OtherServices />} />
        <Route path="/discount-deals" element={<OtherServices />} />
        <Route path="/crowd-prediction" element={<CrowdPrediction />} />
        <Route path="/swap-seat" element={<SwapSeat />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/passengers-details" element={<PassengersDetails />} />
        <Route path="/ticket/:pnrNumber" element={<TicketPage />} />
        <Route path="/swap-seat/options" element={<SwapSeatOptions />} />
        <Route path="/swap-seat/confirm" element={<SwapSeatConfirm />} />
        <Route path="/swap-seat/result" element={<SwapSeatResult />} />
        <Route path="/swap-seat/success" element={<SwapSeatSuccess />} />
        <Route path="/swap-seat/tracking" element={<SwapSeatTracking />} />
       
      </Routes>
    </Router>
  );
}

export default App;