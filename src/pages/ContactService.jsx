import React from "react";
import "../styles/ContactService.css";

import BackButton from "../components/BackButton";

const ContactService = () => {
  return (
    <div className="contact-page">
      <div className="contact-box">
        <BackButton />
        <div className="contact-topbar">You may contact us</div>

        <div className="contact-content">
          <div className="contact-header">
            <h2>For Any Queries Related to Railway Tickets Booked via IRCTC</h2>
            <p className="contact-subtitle">
              Get support for e-ticket booking, cancellation, TDR filing, wallet issues and loyalty card complaints.
            </p>
          </div>

          <div className="contact-section">
            <h3>Customer Support</h3>

            <div className="info-card">
              <p>
                Customers can submit and track queries through the enhanced IRCTC eQuery interface:
              </p>
              <a href="https://equery.irctc.co.in/" target="_blank" rel="noreferrer">
                https://equery.irctc.co.in/
              </a>
            </div>

            <div className="info-card">
              <p>
                In case of cancellation or TDR filing issues, write to:
              </p>
              <a href="mailto:etickets@irctc.co.in">etickets@irctc.co.in</a>
            </div>

            <div className="highlight-card">
              <span>📞 Within India</span>
              <strong>Dial 14646</strong>
            </div>

            <div className="info-card">
              <p>Support is available in these languages:</p>
              <p>
                Hindi, English, Punjabi, Bengali, Assamese, Odia, Marathi,
                Gujarati, Tamil, Telugu, Kannada and Malayalam.
              </p>
            </div>
          </div>

          <div className="contact-section">
            <h3>Customer Support (Outside India)</h3>

            <div className="highlight-card multi">
              <span>📞 International Support</span>
              <strong>
                <a href="tel:+918044647999">+91-8044647999</a>
              </strong>
              <strong>
                <a href="tel:+918035734999">+91-8035734999</a>
              </strong>
            </div>

            <div className="info-card">
              <p>For queries related to I Mudra wallet:</p>
              <a href="https://equery.irctc.co.in/" target="_blank" rel="noreferrer">
                https://equery.irctc.co.in/
              </a>
            </div>
          </div>

          <div className="contact-section">
            <h3>IRCTC Loyalty Credit Card Complaint</h3>

            <div className="info-card">
              <p>
                Loyalty Credit Card: <strong>IRCTC-SBI</strong>
              </p>
            </div>

            <div className="highlight-card multi">
              <span>📞 Contact Numbers</span>
              <strong>
                <a href="tel:012439021212">0124-39021212</a>
              </strong>
              <strong>
                <a href="tel:18001801295">18001801295</a>
              </strong>
            </div>

            <div className="info-card">
              <p>Email / URL:</p>
              <a href="mailto:customercare@sbicard.com">
                customercare@sbicard.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactService;