import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      navigate(role === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/auth/login-${role}`, { email, password });
      const { token, role: userRole } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      navigate(userRole === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <label htmlFor="role">I am a:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
