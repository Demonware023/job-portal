// src/pages/PostJob.js
import React, { useState } from 'react';
import axios from 'axios';

function PostJob() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      alert('You must be logged in to post a job');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/jobs',
        { title, company, description, location },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
      );

      alert('Job posted successfully!');
      // Optionally clear the form fields after successful submission
      setTitle('');
      setCompany('');
      setDescription('');
      setLocation('');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job'); // Alert the user in case of failure
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a Job</h2>
      <div>
        <label>Job Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Company</label>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <button type="submit">Post Job</button>
    </form>
  );
}

export default PostJob;