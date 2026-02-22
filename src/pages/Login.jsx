import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const Login = () => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('username', email); // OAuth2 expects 'username'
    formData.append('password', password);

    try {
      const response = await apiClient.post('/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
      console.error(err);
    }
  };

  const handleQuickLogin = async () => {
    setError('');
    const formData = new FormData();
    formData.append('username', 'admin');
    formData.append('password', '123');

    try {
      const response = await apiClient.post('/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Quick login failed. Ensure test user exists.');
      console.error(err);
    }
  };

  // Temporary function to seed a test user
  const createTestUser = async () => {
    try {
      await apiClient.post('/users/', {
        email: 'admin@iosh.lk',
        password: 'password',
        full_name: 'Admin User',
        role: 'admin'
      });
      alert('Test user created! You can now login.');
    } catch (err) {
      alert('User already exists or error creating user.');
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>IOSH System Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

      <button
        onClick={handleQuickLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px',
          transition: 'transform 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.9'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        <span>🚀</span> Quick Access (Demo Dashboard)
      </button>

      <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
        <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
        <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#fff', padding: '0 10px', color: '#999', fontSize: '12px' }}>
          OR USE CREDENTIALS
        </span>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={createTestUser} style={{ fontSize: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
          (Dev) Create Test User
        </button>
      </div>
    </div>
  );
};

export default Login;
