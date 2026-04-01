import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";
import image3 from '../assets/Images/image3.jpg'; // Training/Services Banner

const Services = () => {
  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Header Banner - Services */}
      <section className="intro-section" style={{
        backgroundImage: `url(${image3})`,
        minHeight: '400px',
        marginTop: 0,
        padding: '100px 20px'
      }}>
        <div className="intro-overlay"></div>
        <div className="shape-triangle-right-purple" style={{ bottom: '20%' }}></div>

        <div className="intro-text-container" style={{ zIndex: 10 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', animation: 'fadeInUp 0.8s ease-out' }}>Our Services</h1>
          <p style={{ fontSize: '1.2rem', animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}>
            Specialized Occupational Safety, Health, and Environmental Solutions
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="content-section" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="shape-triangle-bottom-left-teal" style={{ left: '-50px', transform: 'rotate(0deg)' }}></div>

        <div className="about-container" style={{ maxWidth: '1200px' }}>
          <h2 style={{ marginBottom: '10px', fontWeight: 800, color: '#333', fontSize: '2.5rem' }}>What We Offer</h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>Providing industry-leading expertise to ensure your workplace is safe, compliant, and productive.</p>

          <div className="services-page-grid">

            {/* Service 1 */}
            <div className="service-card">
              <div className="service-icon">🏥</div>
              <h3>Medical Services</h3>
              <p>Comprehensive fitness-to-work examinations, pre-employment screening, and annual medical checkups tailored for industrial workers.</p>
            </div>

            {/* Service 2 */}
            <div className="service-card">
              <div className="service-icon">🧪</div>
              <h3>Environmental Testing</h3>
              <p>Precision laboratory testing for air quality, noise, water, and specialized industrial hygiene monitoring.</p>
            </div>

            {/* Service 3 */}
            <div className="service-card">
              <div className="service-icon">🎓</div>
              <h3>Safety Training</h3>
              <p>Certified training programs including First Aid, Fire Safety, Chemical Handling, and bespoke OSH awareness sessions.</p>
            </div>

            {/* Service 4 */}
            <div className="service-card">
              <div className="service-icon">📋</div>
              <h3>Audits & Consulting</h3>
              <p>Expert safety audits (ISO 45001), risk assessments, and consultancy to ensure legal compliance and best practices.</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
