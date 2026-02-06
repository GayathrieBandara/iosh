import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const Login = () => {
  const [email, setEmail] = useState('admin@iosh.lk');
  const [password, setPassword] = useState('password');
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
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
