import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      console.log('Making request to: /api/users/login');
      const res = await axios.post('/api/users/login', {
        email,
        password
      });
      console.log('Login response:', res);
      console.log('Login response data:', res.data);
      console.log('Login response status:', res.status);

      if (res.data === 'Login successful!') {
        console.log('Login successful, navigating to dashboard');
        setIsLoggedIn(true);
        localStorage.setItem('userEmail', email);  // Store the email
        localStorage.setItem('isLoggedIn', 'true');  // Store login state
        navigate('/dashboard');
      } else {
        console.log('Login failed with message:', res.data);
        setMessage(res.data);
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
      }
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="auth-button">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
