import React, { useState } from 'react';
import './login.css';

const RegisterJobSeeker = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register-jobseeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'jobseeker' }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Registration successful! Please log in.');
        window.location.href = '/login'; // Redirect to login page
      } else {
        setError(data.msg || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Register as Job Seeker</h2>
      <form onSubmit={handleRegistration}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <div>
          <label>Role:</label>
          <input type="text" value="Jobseeker" readOnly />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterJobSeeker;
