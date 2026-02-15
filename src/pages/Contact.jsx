import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import "../styles/Contact.css";

const Contact = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    alert("Thank you for contacting us! We will get back to you shortly.");
  };

  return (
    <div className="contact-wrapper">
      <Navbar />

      {/* Hero Section */}
      <div className="contact-hero">
        <Container>
          <h1>Contact Us</h1>
          <p>Get in touch with the Institute of Occupational Safety & Health. We are here to answer any questions you may have.</p>
        </Container>
      </div>

      <Container className="mb-5">
        <Row>
          {/* Contact Information */}
          <Col lg={5} md={12} className="mb-4 mb-lg-0">
            <div className="contact-info-card">
              <h3 className="mb-4">Get In Touch</h3>

              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>No. 111/4/C, Main Street,<br />Battaramulla, Sri Lanka</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaPhoneAlt />
                </div>
                <div className="contact-details">
                  <h4>Call Us</h4>
                  <p><a href="tel:+94112885994">+94 11 288 5994</a></p>
                  <p><a href="tel:+94777322322">+94 77 732 2322</a></p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p><a href="mailto:info@iosh.lk">info@iosh.lk</a></p>
                  <p><a href="mailto:admin@iosh.lk">admin@iosh.lk</a></p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaClock />
                </div>
                <div className="contact-details">
                  <h4>Opening Hours</h4>
                  <p>Mon - Fri: 8:30 AM - 5:00 PM</p>
                  <p>Sat - Sun: Closed</p>
                </div>
              </div>
            </div>
          </Col>

          {/* Contact Form */}
          <Col lg={7} md={12}>
            <div className="contact-form-card">
              <h3 className="mb-4">Send us a Message</h3>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formName">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" required />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type="email" placeholder="Enter your email" required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" placeholder="Subject of your message" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Type your message here..." required />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-primary-custom">
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Map Section */}
      <div className="map-section">
        <iframe
          title="IOSH Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.468200639436!2d79.9126274!3d6.9069274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2576974766e47%3A0xc34b726058fc553e!2sBattaramulla!5e0!3m2!1sen!2slk!4v1715421234567!5m2!1sen!2slk"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
