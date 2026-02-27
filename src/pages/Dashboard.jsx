import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [myCerts, setMyCerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
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
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>IOSH Dashboard</h1>
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <div className="welcome-banner" style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '5px solid #2196f3' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Welcome, {user.full_name}!</h2>
        <div style={{ display: 'flex', gap: '20px', color: '#555' }}>
          <span>Role: <strong>{user.role.toUpperCase()}</strong></span>
          <span>Email: {user.email}</span>
        </div>
      </div>

      {user.role === 'admin' ? (
        <div className="admin-view">
          <h3>Admin Overview</h3>
          {stats ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={cardStyle}>
                <h4>Total Users</h4>
                <p style={statStyle}>{stats.total_users}</p>
              </div>
              <div style={cardStyle}>
                <h4>Active Certs</h4>
                <p style={statStyle}>{stats.active_certs}</p>
              </div>
              <div style={cardStyle}>
                <h4>Pending</h4>
                <p style={statStyle}>{stats.pending_assessments}</p>
              </div>
              <div style={cardStyle}>
                <h4>Revenue</h4>
                <p style={statStyle}>LKR {stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          ) : <p>Loading stats...</p>}

          <div className="ai-section" style={{ marginTop: '40px', padding: '20px', border: '1px solid #cce5ff', borderRadius: '8px', backgroundColor: '#e6f7ff' }}>
            <h3>🤖 AI Safety Forecaster</h3>
            <p>Predict safety risks based on workplace data.</p>
            <form onSubmit={async (e) => {
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
                alert(`Risk Score: ${res.data.risk_score}/100\nLevel: ${res.data.classification}\nSuggestion: ${res.data.recommendation}`);
              } catch (err) {
                alert('Prediction failed');
              }
            }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <label>
                Employees
                <input name="employees" type="number" defaultValue="100" style={{ display: 'block', width: '100%', padding: '8px' }} />
              </label>
              <label>
                Past Accidents
                <input name="accidents" type="number" defaultValue="2" style={{ display: 'block', width: '100%', padding: '8px' }} />
              </label>
              <label>
                Training Hours
                <input name="training" type="number" defaultValue="50" style={{ display: 'block', width: '100%', padding: '8px' }} />
              </label>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Analyze Risk</button>
            </form>
          </div>

          <div style={{ marginTop: '20px' }}></div>
          <button onClick={() => navigate('/admin/certificates')} style={actionButtonStyle}>Manage Certificates</button>
        </div>
      ) : (
        <div className="member-view">
          <h3>My Certificates</h3>
          {myCerts.length === 0 ? (
            <p>No certificates found. <a href="/contact">Contact IOSH</a> to apply.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {myCerts.map(cert => (
                <div key={cert.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: 0, right: 0, padding: '5px 10px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: cert.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: cert.status === 'active' ? '#155724' : '#721c24'
                  }}>
                    {cert.status.toUpperCase()}
                  </div>
                  <h4 style={{ marginTop: '10px' }}>{cert.cert_id}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>Type: {cert.type.toUpperCase()}</p>
                  <p style={{ margin: '5px 0' }}>Expires: <strong>{new Date(cert.expiry_date).toLocaleDateString()}</strong></p>
                  <button style={{ marginTop: '10px', padding: '5px 10px', border: '1px solid #0056b3', background: 'white', color: '#0056b3', borderRadius: '4px', cursor: 'pointer' }}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const statStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0056b3',
  margin: '10px 0 0 0'
};

const actionButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0056b3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px'
};

export default Dashboard;
