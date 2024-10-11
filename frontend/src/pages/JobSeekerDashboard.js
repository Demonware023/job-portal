// src/pages/JobSeekerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [role, setRole] = useState('');
  const [applicantId, setApplicantId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Function to decode JWT and get user information
    const getUserInfo = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        setRole(decodedToken.role);
        setApplicantId(decodedToken.id); // Assuming the JWT contains the applicant's ID as 'id'
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`/api/applications/applicant/${applicantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/jobs?page=${page}&limit=10`); // Modify API call to include pagination
        setJobs((prevJobs) => [...prevJobs, ...response.data.jobs]);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    getUserInfo();
    // Fetch applications only if the applicantId is set
    if (applicantId) {
      fetchApplications();
    }
    fetchJobs();
  }, [applicantId, page]); // Run effect whenever applicantId or page changes

  const loadMoreJobs = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/jobs">Available Jobs</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/applied-jobs">Applied Jobs</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="dashboard-content">
        <h1>Your Applications</h1>
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app._id} className="application-card">
              <h3>{app.job.title}</h3>
              <p>Status: {app.status}</p>
              <p>Cover Letter: {app.coverLetter}</p>
              <p>Resume: <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
        
        <h2>Available Jobs</h2>
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Location: {job.location}</p>
              <Link to={`/jobs/${job._id}`}>
                <button className="view-details-button">View Details</button>
              </Link>
              <Link to={`/apply/${job._id}`}>
                <button className="apply-button">Apply Now</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No jobs available.</p>
        )}
        {page < totalPages && (
          <button onClick={loadMoreJobs}>Load More</button>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;