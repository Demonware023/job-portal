import React, { useState } from 'react';
import axios from 'axios';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');

  const handlePostJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from localStorage
    try {
      const response = await axios.post(
        '/api/employer/jobs',
        { title, description, location, pay },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );
      alert(response.data.msg);
      setTitle('');
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
        <label htmlFor="job-title">Job Title</label>
        <input
          id="job-title" 
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoComplete="on" // Add autocomplete
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