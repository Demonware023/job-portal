// src/pages/JobSeekerApplication.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './JobSeekerApplication.css';

const JobSeekerApplication = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/jobseeker/my-applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="application-page">
      <h1>My Applications</h1>
      <Link to="/job-application" className="apply-link">Apply for a New Job</Link>
      {applications.length > 0 ? (
        applications.map(app => (
          <div key={app._id} className="application-card">
            <h3>{app.job?.title || 'Job title not available'}</h3>
            <p>Status: {app.status}</p>
            <p>Cover Letter: {app.coverLetter}</p>
            <p>Resume: <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
          </div>
        ))
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default JobSeekerApplication;