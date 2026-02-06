import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css"

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
        </div>

        {/* Three Cards Overlapping */}
        <div className="hero-cards-container">
          <div className="hero-card">
            <div className="card-image img-env"></div>
            <h3>Environmental Monitoring</h3>
          </div>
          <div className="card">
            <div className="card-image img-med"></div>
            <h3>Medical Testing & Fitness-to-Work Assessments</h3>
          </div>
          <div className="card">
            <div className="card-image img-training"></div>
            <h3>Occupational Safety & Health Training</h3>
          </div>
        </div>
      </header>

      {/* Intro Section - Teal Background */}
      <section className="intro-section">
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
              {/* Placeholder for the tree logo */}
              <div className="logo-placeholder-tree">
                <img src="https://placehold.co/100x100?text=Logo" alt="Central Environmental Authority" />
                <p>මධ්‍යම පරිසර අධිකාරිය<br />மத்திய சுற்றாடல் அதிகாரசபை<br />Central Environmental Authority</p>
              </div>
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
      <section className="middle-banner">
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
        <div className="team-member">
          <div className="team-photo photo-ruwan"></div>
          <h4>Dr Ruwan Wijayamuni</h4>
          <p>CEO IOSH</p>
          {/* <p className="designation-sub">Consultant Occupational Physician</p> */}
        </div>
        <div className="team-member">
          <div className="team-photo photo-ramya"></div>
          <h4>Ms Ramya Jamburegoda</h4>
          <p>Chief Occupational Hygienist</p>
        </div>
        <div className="team-member">
          <div className="team-photo photo-champika"></div>
          <h4>Dr Champika Amarasinghe</h4>
          <p>Chairperson IOSH</p>
          {/* <p className="designation-sub">Consultant Community Physician</p> */}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
