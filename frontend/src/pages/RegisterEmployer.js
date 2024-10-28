import React, { useState } from 'react';
import './login.css';

const RegisterEmployer = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register-employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Registration failed. Please try again.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      alert('Registration successful! Please log in.');
      window.location.href = '/login'; // Redirect to login page
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Register as Employer</h2>
      <form onSubmit={handleRegistration}>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <div>
          <label>Role:</label>
          <input type="text" value="Employer" readOnly />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterEmployer;
