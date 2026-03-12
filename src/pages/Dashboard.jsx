import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import '../styles/AdminDashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [myCerts, setMyCerts] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('token');

      // Auto-login if no token is found
      if (!token) {
        console.log("No token found, attempting auto-login...");
        try {
          const formData = new FormData();
          formData.append('username', 'admin');
          formData.append('password', '123');

          const loginRes = await apiClient.post('/token', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          token = loginRes.data.access_token;
          localStorage.setItem('token', token);
          console.log("Auto-login successful");
        } catch (loginErr) {
          console.error('Auto-login failed', loginErr);
          navigate('/');
          return;
        }
      }

      try {
        // 1. Get User
        const userRes = await apiClient.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        // 2. Fetch Data based on Role
        if (userRes.data.role === 'admin') {
          const statsRes = await apiClient.get('/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(statsRes.data);
        } else {
          const certsRes = await apiClient.get('/certificates/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyCerts(certsRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
        localStorage.removeItem('token');
        window.location.reload();
      }
    };

    fetchData();
  }, [navigate]);

  const handlePredict = async (e) => {
    e.preventDefault();
    const employees = e.target.employees.value;
    const accidents = e.target.accidents.value;
    const training = e.target.training.value;

    try {
      const res = await apiClient.post('/predict', {
        employees: parseInt(employees),
        accidents: parseInt(accidents),
        training_hours: parseInt(training)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPrediction(res.data);
    } catch (err) {
      alert('Prediction failed');
    }
  };

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p style={{ marginTop: '16px', color: '#666', fontWeight: 600 }}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 className="dashboard-header">IOSH Dashboard</h1>
            <p className="dashboard-subtitle">Overview &amp; management console</p>
          </div>
          <button
            className="btn-logout-light"
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          >
            ✦ Logout
          </button>
        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h2>Welcome back, {user.full_name} 👋</h2>
          <div className="user-meta">
            <span>Role: <strong>{user.role.toUpperCase()}</strong></span>
            <span>Email: <strong>{user.email}</strong></span>
          </div>
        </div>

        {user.role === 'admin' ? (
          <div className="admin-view">
            {/* Stats Grid */}
            {stats ? (
              <div className="stats-grid">
                <div className="light-card stat-card">
                  <div className="stat-icon-wrapper blue">👥</div>
                  <div className="stat-value">{stats.total_users}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="light-card stat-card">
                  <div className="stat-icon-wrapper green">📜</div>
                  <div className="stat-value">{stats.total_certs}</div>
                  <div className="stat-label">Issued Certificates</div>
                </div>
                <div className="light-card stat-card">
                  <div className="stat-icon-wrapper orange">⏳</div>
                  <div className="stat-value">{stats.active_certs}</div>
                  <div className="stat-label">Active Valid</div>
                </div>
                <div className="light-card stat-card">
                  <div className="stat-icon-wrapper teal">💰</div>
                  <div className="stat-value">Rs. {stats.revenue.toLocaleString()}</div>
                  <div className="stat-label">Revenue</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="loader"></div>
              </div>
            )}

            {/* AI Forecaster Panel */}
            <div className="forecaster-panel">
              <div className="forecaster-header">
                <h3>🤖 AI Safety Forecaster</h3>
                <span className="ai-badge">✦ ML Powered</span>
              </div>
              <p className="forecaster-desc">Predict safety risks based on workplace data using machine learning models.</p>

              <form className="light-form" onSubmit={handlePredict}>
                <div>
                  <label>Employees</label>
                  <input name="employees" type="number" defaultValue="100" placeholder="e.g. 100" />
                </div>
                <div>
                  <label>Past Accidents</label>
                  <input name="accidents" type="number" defaultValue="2" placeholder="e.g. 2" />
                </div>
                <div>
                  <label>Training Hours</label>
                  <input name="training" type="number" defaultValue="50" placeholder="e.g. 50" />
                </div>
                <div>
                  <button type="submit" className="btn-primary-action">Analyze Risk</button>
                </div>
              </form>

              {/* Prediction Result */}
              {prediction && (
                <div className="light-card" style={{ marginTop: '24px', textAlign: 'center', border: '2px solid #eee' }}>
                  <div className="stat-value" style={{ fontSize: '3rem', color: '#F94A00' }}>
                    {prediction.risk_score}/100
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 24px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.9rem',
                    marginTop: '8px',
                    backgroundColor: prediction.classification === 'Low' ? '#e8f5e9' :
                      prediction.classification === 'Medium' ? '#fff3e0' :
                        '#ffebee',
                    color: prediction.classification === 'Low' ? '#2e7d32' :
                      prediction.classification === 'Medium' ? '#ef6c00' :
                        '#c62828',
                    border: '1px solid currentColor'
                  }}>
                    {prediction.classification} Risk
                  </div>
                  {prediction.recommendation && (
                    <div style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      color: '#333',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      marginTop: '20px',
                      borderLeft: '5px solid #0E5B5E',
                      textAlign: 'left',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                      <strong>💡 Recommendation:</strong> {prediction.recommendation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-light-action highlight" onClick={() => navigate('/admin/certificates')}>
                📜 Manage Certificates
              </button>
              <button className="btn-light-action" onClick={() => navigate('/admin/users')}>
                👥 Manage Users
              </button>
              <button className="btn-light-action" onClick={() => navigate('/admin/analysis')}>
                📊 Analytics
              </button>
            </div>
          </div>
        ) : (
          <div className="member-view">
            <div className="section-header">
              <div>
                <h3 className="section-title">My Certificates</h3>
                <p className="section-subtitle">Your issued IOSH certificates</p>
              </div>
            </div>

            {myCerts.length === 0 ? (
              <div className="light-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ color: '#777', fontSize: '1.1rem' }}>No certificates found. <a href="/contact" style={{ color: '#F94A00', fontWeight: 600 }}>Contact IOSH</a> to apply.</p>
              </div>
            ) : (
              <div className="certs-grid">
                {myCerts.map(cert => (
                  <div key={cert.id} className="cert-card-light">
                    <span className={`cert-status-badge ${cert.status === 'active' ? 'active' : 'expired'}`}>
                      {cert.status.toUpperCase()}
                    </span>
                    <h4>{cert.cert_id}</h4>
                    <p className="cert-type">Type: {cert.type.toUpperCase()}</p>
                    <p className="cert-expiry">Expires: <strong>{new Date(cert.expiry_date).toLocaleDateString()}</strong></p>
                    <button className="btn-details-light">View Details</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
