// src/pages/JobApplication.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './JobApplication.css'; // Add this line to import CSS styles

const JobApplication = () => {
  const { jobId } = useParams();
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedPay, setExpectedPay] = useState('');
  const [resume, setResume] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/jobseeker/jobs/${jobId}/apply`, {
        coverLetter,
        expectedPay,
        resume
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.msg);
    } catch (error) {
      console.error('Error submitting application:', error);
      setMessage('Failed to submit application.');
    }
  };

  return (
    <div className="application-page">
      <h1>Apply for Job</h1>
      <form onSubmit={handleSubmit}>
        <label>Cover Letter</label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
        />

        <label>Expected Pay</label>
        <input
          type="text"
          value={expectedPay}
          onChange={(e) => setExpectedPay(e.target.value)}
          required
        />

        <label>Resume (Link)</label>
        <input
          type="text"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          required
        />

        <button type="submit">Submit Application</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default JobApplication;