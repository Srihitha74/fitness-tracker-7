import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting registration with:', { email, password });
      console.log('Making request to: /api/users/register');
      const res = await axios.post('/api/users/register', {
        email,
        password
      });
      console.log('Registration response:', res);
      console.log('Registration response data:', res.data);
      console.log('Registration response status:', res.status);
      setMessage('Registration successful! You can now login.');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        setMessage(`Registration failed: ${err.response.data}`);
      } else {
        setMessage('Registration failed. Please check your connection.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="auth-button">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;
