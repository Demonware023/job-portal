// src/pages/EmployerProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('/api/employer/profile')
      .then(response => {
        const { companyName, description } = response.data;
        setCompanyName(companyName || '');
        setDescription(description || '');
      })
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/employer/profile', { companyName, description });
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile. Try again.');
    }
  };

  return (
    <div>
      <h2>Employer Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Company Description"
          required
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EmployerProfile;