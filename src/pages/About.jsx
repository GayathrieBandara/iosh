import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css"; // Reuse styling
import image2 from '../assets/Images/image2.jpg'; // Banner
import portrait3 from '../assets/Images/portrait3.png'; // Chairperson

const About = () => {
  return (
    <div className="home-wrapper"> {/* Reuse wrapper for consistency */}
      <Navbar />

      {/* Header Banner */}
      <section className="intro-section" style={{
        backgroundImage: `url(${image2})`,
        minHeight: '400px',
        marginTop: 0,
        padding: '100px 20px'
      }}>
        <div className="intro-overlay"></div>
        <div className="shape-triangle-left-small" style={{ top: '60%' }}></div>

        <div className="intro-text-container" style={{ zIndex: 10 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', animation: 'fadeInUp 0.8s ease-out' }}>About Us</h1>
          <p style={{ fontSize: '1.2rem', animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}>
            Leading the way in Occupational Safety & Health in Sri Lanka
          </p>
        </div>
      </section>

      {/* Content Section (White with Shapes) */}
      <section className="content-section">
        {/* Reuse shapes */}
        <div className="shape-triangle-center-purple"></div>

        <div className="about-container">
          <h2 style={{ marginBottom: '30px', fontWeight: 800, color: '#333', fontSize: '2.5rem' }}>Who We Are</h2>
          <p style={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#555', marginBottom: '30px', maxWidth: '800px', margin: '0 auto' }}>
            The Institute of Occupational Safety and Health (IOSH) Sri Lanka is the pioneer organization promoting workplace safety, health, and productivity.
            Founded with the goal of supporting industries in achieving compliance with both national legislation and international occupational health and safety standards.
          </p>

          <div className="about-grid">
            <div className="about-image">
              <img src={portrait3} alt="Dr Champika Amarasinghe" />
            </div>
            <div className="about-text">
              <h3>Our Vision</h3>
              <p>To be the center of excellence in cost-effective Occupational Safety and Health care delivery in the region.</p>

              <h3>Our Mission</h3>
              <p>To provide high-quality OSH services, training, and audits to ensure compliance and promote safe and healthy working environments for all industries in Sri Lanka.</p>

              <h3>Our Values</h3>
              <p>Integrity, Excellence, Collaboration, and Commitment to Safety.</p>
            </div>
          </div>
        </div>

        <div className="shape-triangle-bottom-right-orange"></div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
