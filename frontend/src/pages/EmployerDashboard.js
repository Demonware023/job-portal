import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/employer/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Fetched jobs:', response.data); // Log the jobs to verify the data
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/employer/applications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchJobs();
    fetchApplications();
  }, []);

  // Handle accepting or rejecting an application
  const handleApplicationAction = async (jobId, appId, status) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}/applications/${appId}`, { status });
      alert(response.data.msg);
      const updatedApplications = applications.map((app) => 
        app._id === appId ? { ...app, status } : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      alert('Failed to update application status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to the login page after logging out
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/jobs">Your Jobs</Link></li>
            <li><Link to="/applications">Applications</Link></li>
            <li><Link to="/post-job">Post Job</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <div className="header">
          <div className="profile-section">
            <img src="path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
            <div className="dropdown">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">▼</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
          <h2>Your Jobs</h2>
        </div>

        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Location: {job.location}</p>
              <h4>Applications</h4>
              {job.applications.length > 0 ? (
                job.applications.map(app => (
                  <div key={app._id} className="application-card">
                    <p>Applicant: {app.jobSeekerId.name} ({app.jobSeekerId.email})</p>
                    <p>Status: {app.status}</p>
                    <p>Cover Letter: {app.coverLetter}</p>
                    <p>Expected Pay: {app.expectedPay}</p>
                    <button onClick={() => handleApplicationAction(job._id, app._id, 'accepted')}>Accept</button>
                    <button onClick={() => handleApplicationAction(job._id, app._id, 'rejected')}>Reject</button>
                  </div>
                ))
              ) : (
                <p>No applications yet.</p>
              )}
              <Link to={`/applications/${job._id}`}>
                <button className="view-applications-button">View Applications</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}

        {/* Display All Applications */}
        <h2>All Applications</h2>
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app._id} className="application-card">
              <h3>{app.job.title}</h3>
              <p>Status: {app.status}</p>
              <p>Applicant: {app.jobSeekerId.name} ({app.jobSeekerId.email})</p>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;