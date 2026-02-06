import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/home.css'; // Assuming styles will be added here

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Column 1: Contact Info */}
        <div className="footer-col">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt className="footer-icon" />
              <span>
                Institute of Occupational Safety & Health,<br />
                No 123, Main Street,<br />
                Colombo, Sri Lanka.
              </span>
            </li>
            <li>
              <FaPhoneAlt className="footer-icon" />
              <span>General: +94 11 234 5678</span>
            </li>
            <li>
              <FaPhoneAlt className="footer-icon" />
              <span>Hotline: +94 77 123 4567</span>
            </li>
            <li>
              <FaEnvelope className="footer-icon" />
              <span>info@iosh.lk</span>
            </li>
          </ul>
          <div className="payment-methods">
            <span className="visa">VISA</span>
            <span className="mastercard">MasterCard</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><FaCheckCircle className="link-icon" /> <Link to="/">Home</Link></li>
            <li><FaCheckCircle className="link-icon" /> <Link to="/about">About Us</Link></li>
            <li><FaCheckCircle className="link-icon" /> <Link to="/services">Services</Link></li>
            <li><FaCheckCircle className="link-icon" /> <Link to="/contact">Contact</Link></li>
            <li><FaCheckCircle className="link-icon" /> <Link to="/gallery">Gallery</Link></li>
          </ul>
        </div>

        {/* Column 3: Facebook Widget (Placeholder) */}
        <div className="footer-col">
          <h3 className="footer-heading">Facebook</h3>
          <div className="facebook-widget">
            <div className="fb-header">
              <FaFacebook className="fb-logo" />
              <span>IOSH Sri Lanka</span>
            </div>
            <div className="fb-content">
              <p>Follow us on Facebook for updates!</p>
              {/* In a real app, embed the FB iframe here */}
            </div>
          </div>
        </div>

        {/* Column 4: Map (Placeholder) */}
        <div className="footer-col">
          <h3 className="footer-heading">Find Us</h3>
          <div className="map-widget">
            {/* Placeholder for Google Maps iframe */}
            <div className="map-placeholder">
              <FaMapMarkerAlt size={30} />
              <p>Google Map Loading...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>IOSH Sri Lanka © 2026 | All Rights Reserved | Designed by WEYS</p>
      </div>
    </footer>
  );
};

export default Footer;
