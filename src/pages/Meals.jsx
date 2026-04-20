import React, { useState } from "react";
import "../styles/Meals.css";

import BackButton from "../components/BackButton";

const Meals = () => {
  const [selectedCategory, setSelectedCategory] = useState("pantry");

  const foodData = {
    pantry: [
      { name: "Veg Thali", price: "₹120", desc: "Rice, dal, sabji, roti" },
      { name: "Paneer Meal", price: "₹150", desc: "Paneer curry with chapati" },
      { name: "South Indian Combo", price: "₹100", desc: "Idli, vada, sambar" },
      { name: "Breakfast Pack", price: "₹80", desc: "Poha, tea, biscuit" },
      { name: "Mini Meal", price: "₹90", desc: "Rice, curry, pickle" },
      { name: "Snack Box", price: "₹70", desc: "Samosa, chutney, tea" }
    ],
    catering: [
      { name: "Chicken Biryani", price: "₹180", desc: "Spicy biryani with raita" },
      { name: "Egg Curry Meal", price: "₹130", desc: "Egg curry with rice" },
      { name: "Veg Pulao", price: "₹110", desc: "Pulao with curd and salad" },
      { name: "Special Lunch", price: "₹160", desc: "Full lunch combo" },
      { name: "Dinner Combo", price: "₹170", desc: "Rice, dal, sabji, sweet" },
      { name: "Family Pack", price: "₹250", desc: "Meal for 2 people" }
    ],
    cooked: [
      { name: "Dal Fry Rice", price: "₹100", desc: "Fresh cooked dal and rice" },
      { name: "Rajma Chawal", price: "₹110", desc: "Rajma with steamed rice" },
      { name: "Kadhi Chawal", price: "₹100", desc: "Kadhi with rice and salad" },
      { name: "Aloo Paratha", price: "₹90", desc: "2 paratha with curd" },
      { name: "Masala Dosa", price: "₹95", desc: "Dosa with chutney and sambar" },
      { name: "Plain Khichdi", price: "₹85", desc: "Light and healthy meal" }
    ]
  };

  return (
    <div className="meals-page">
      <div className="meals-sidebar">
        <BackButton />
        <div className="meals-offer">Upto 10% Cashback</div>

        <div
          className={`meals-item ${selectedCategory === "pantry" ? "active" : ""}`}
          onClick={() => setSelectedCategory("pantry")}
        >
          Book Food – E-Pantry
        </div>

        <div
          className={`meals-item ${selectedCategory === "catering" ? "active" : ""}`}
          onClick={() => setSelectedCategory("catering")}
        >
          Order Food – E-Catering
        </div>

        <div
          className={`meals-item ${selectedCategory === "cooked" ? "active" : ""}`}
          onClick={() => setSelectedCategory("cooked")}
        >
          Cooked Food Menu
        </div>
      </div>

      <div className="meals-content">
        <div className="meals-header">
          <h2>Available Meals</h2>
          <p>Select your preferred food option for the journey</p>
        </div>

        <div className="food-grid">
          {foodData[selectedCategory].map((item, index) => (
            <div className="food-card" key={index}>
              <h3>{item.name}</h3>
              <p className="food-desc">{item.desc}</p>
              <p className="food-price">{item.price}</p>
              <button className="order-btn">Order Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Meals;