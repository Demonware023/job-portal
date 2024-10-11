// src/pages/Register.js
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('jobSeeker'); // Default role
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
          });
    
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Registration successful!');
            // Redirect to the login page
            window.location.href = '/login'; // Redirection to login page after successful registration using JV win.loc.href
          } else {
            alert(data.msg || 'Registration failed. Please try again.'); // Default message for login failure
          }
        } catch (err) {
          console.error('Error:', err);
          alert('An error occurred. Please try again later.'); // General error message
        }
      };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="jobSeeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;