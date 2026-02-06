import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css"
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import image1 from '../assets/Images/image1.jpg';
import image2 from '../assets/Images/image2.jpg';
import image3 from '../assets/Images/image3.jpg';
import image8 from '../assets/Images/image8.png';
import logo2 from '../assets/Images/logo2.png';
import image5 from '../assets/Images/image5.png';
import bannerBg from '../assets/Images/image4.jpg'; /* Guessing this is the helmet image */
import image6 from '../assets/Images/image6.png';
import image7 from '../assets/Images/image7.png';
import portrait1 from '../assets/Images/portrait1.png'; // Dr Ruwan
import portrait2 from '../assets/Images/portrait2.png'; // Ms Ramya
import portrait3 from '../assets/Images/portrait3.png'; // Dr Champika

const Home = () => {
  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="shape-triangle-top-right"></div>
        <div className="shape-triangle-left-hero"></div>

        <div className="hero-content">
          <h1>Institute of Occupational Safety & Health</h1>
          <h2>Sri Lanka</h2>

          <Carousel fade>
            <Carousel.Item>
              <img src={image1} alt="Workplace Safety" className="d-block w-100" />
            </Carousel.Item>
            <Carousel.Item>
              <img src={image2} alt="Health Monitoring" className="d-block w-100" />
            </Carousel.Item>
            <Carousel.Item>
              <img src={image3} alt="Professional Training" className="d-block w-100" />
            </Carousel.Item>
          </Carousel>
        </div>

        {/* Three Cards Overlapping */}
        <div className="hero-cards-container">
          <div className="hero-card">
            <img src={image5} alt="Environmental Monitoring" className="card-image" />
            <h3>Environmental Monitoring</h3>
          </div>
          <div className="card">
            <img src={image6} alt="Medical Testing" className="card-image" />
            <h3>Medical Testing & Fitness-to-Work Assessments</h3>
          </div>
          <div className="card">
            <img src={image7} alt="Training" className="card-image" />
            <h3>Occupational Safety & Health Training</h3>
          </div>
        </div>
      </header>

      {/* Intro Section - Teal Background */}
      <section className="intro-section" style={{ backgroundImage: `url(${image8})` }}>
        <div className="intro-overlay"></div>
        <div className="shape-triangle-left-small"></div>
        <div className="shape-triangle-right-purple"></div>

        <div className="intro-text-container">
          <p>
            The Institute of Occupational Safety & Health (IOSH) is the pioneer
            organization promoting workplace safety, health, and productivity.
            Founded with the goal of supporting industries in achieving compliance
            with both national legislation and international occupational health
            and safety standards, IOSH has evolved into a center of excellence
            in cost-effective OSH services.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="shape-triangle-center-purple"></div>

        <div className="services-content">
          <div className="service-left">
            <div className="partner-logo">
              <img src={logo2} alt="Central Environmental Authority" />
            </div>
          </div>

          <div className="service-right">
            <h3>Our Services</h3>
            <ul className="service-list">
              <li>Environmental Monitoring</li>
              <li>Medical Testing and Fitness-to-Work Assessments</li>
              <li>Occupational Safety and Health Training</li>
              <li>Occupational Health and Safety Auditing and Consultancies</li>
            </ul>
          </div>
        </div>

        <div className="shape-triangle-bottom-left-teal"></div>
        <div className="shape-triangle-bottom-right-orange"></div>
      </section>

      {/* Middle Banner - Dark overlay with text */}
      <section className="middle-banner" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="banner-overlay">
          <div className="banner-content">
            <p>
              IOSH is the pioneer and leader in Occupational Safety and Health care
              delivery in Sri Lanka, led by Dr Champika Amarasinghe (MD, MSc,
              Comm. Med, M. Med. Occ. Med, D.Occ. Med MD. Comm. Med.) and her expert
              team at IOSH. She has 25 years of international and national
              experience in the OSH service delivery and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          {/* Member 1 */}
          <div className="team-member">
            <div className="member-photo">
              <img src={portrait1} alt="Dr Ruwan Wijayamuni" />
            </div>
            <div className="member-info">
              <h4>Dr Ruwan<br />Wijayamuni</h4>
              <p className="designation">CEO IOSH</p>
              <p className="sub-designation">Consultant Occupational<br />Physician</p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="team-member">
            <div className="member-photo">
              <img src={portrait2} alt="Ms Ramya Jamburegoda" />
            </div>
            <div className="member-info">
              <h4>Ms Ramya<br />Jamburegoda</h4>
              <p className="designation">Chief Occupational<br />Hygienist</p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="team-member">
            <div className="member-photo">
              <img src={portrait3} alt="Dr Champika Amarasinghe" />
            </div>
            <div className="member-info">
              <h4>Dr Champika<br />Amarasinghe</h4>
              <p className="designation">Chairperson IOSH</p>
              <p className="sub-designation">Consultant Community<br />Physician</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
