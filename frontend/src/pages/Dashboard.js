import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Fetch jobs from the backend
    axios.get('http://localhost:5000/api/jobs')
      .then(response => {
        setJobs(response.data);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });

    // Get user role from local storage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      setRole(decodedToken.role);
    }
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/jobs">Jobs</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            {role === 'employer' && (
              <li><Link to="/post-job">Post Job</Link></li>
            )}
          </ul>
        </nav>
      </aside>

      <div className="dashboard-content">
        <h1>Welcome to the Dashboard</h1>

        {/* Job Listings */}
        <section className="job-listings">
          <h2>Available Jobs</h2>
          {jobs.length > 0 ? (
            <ul>
              {jobs.map(job => (
                <li key={job._id} className="job-item">
                  <h3>{job.title}</h3>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Description:</strong> {job.description}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;