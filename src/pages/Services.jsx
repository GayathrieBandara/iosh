import Navbar from "../components/Navbar";
const Services = () => {
  return (
    <div className="services-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#0056b3' }}>Our Services</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>Comprehensive Occupational Safety and Health Services for Sri Lankan Industries.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div style={cardStyle}>
          <h3>🏥 Medical Examinations</h3>
          <p>Annual medical checkups for industrial workers, issuing "Fit for Work" certificates compliant with national regulations.</p>
        </div>
        <div style={cardStyle}>
          <h3>🧪 Environmental Testing</h3>
          <p>Laboratory testing for air quality, noise levels, and water safety in factories and workplaces.</p>
        </div>
        <div style={cardStyle}>
          <h3>🎓 Safety Training</h3>
          <p>Certified training programs on Fire Safety, First Aid, and Chemical Handling with recognized certification.</p>
        </div>
        <div style={cardStyle}>
          <h3>📋 Workplace Audits</h3>
          <p>On-site safety audits to identify hazards and ensure compliance with ISO-45001 standards.</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

export default Services;
