// src/pages/RegisterEmployer.js
import React, { useState } from 'react';

const RegisterEmployer = () => {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, email, password, role: 'employer' }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Registration successful!');
        window.location.href = '/login'; // Redirect to login
      } else {
        alert(data.msg || 'Registration failed. Try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register as Employer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        {/* Display role as read-only */}
        <div>
            <label>Role: </label>
            <input type="text" value="Employer" readOnly />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterEmployer;