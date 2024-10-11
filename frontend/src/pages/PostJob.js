// src/pages/PostJob.js
import React, { useState } from 'react';
import axios from 'axios';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/employer/jobs', {
        title,
        company,
        description,
        location,
        pay,
      });
      alert(response.data.msg);
      setTitle('');
      setCompany('');
      setDescription('');
      setLocation('');
      setPay('');
    } catch (error) {
      alert('Failed to post the job. Try again.');
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      <form onSubmit={handlePostJob}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Pay"
          value={pay}
          onChange={(e) => setPay(e.target.value)}
          required
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;