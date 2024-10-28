import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployerDashboard.css';
import HomeIcon from '../components/HomeIcon';

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
        console.log('Fetched jobs:', response.data);
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
        console.log('Fetched applications:', response.data);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchJobs();
    fetchApplications();
  }, []);

  // Handle application status updates
  const handleApplicationAction = async (appId, status, jobId) => {
    console.log('Handling application action:', { appId, status, jobId }); // Debugging line

    // Check if appId is defined
    if (!appId) {
      console.error('Application ID is undefined');
      alert('Application ID is undefined. Cannot update status.');
      return;
    }

    try {
      const response = await axios.patch(
        `/api/employer/jobs/${jobId}/applications/${appId}`, 
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(response.data.msg);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );
    } catch (error) {
      alert('Failed to update application status.');
      console.error('Error updating application status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Job Portal</h2>
        <div className="logo" />
        <nav>
          <ul>
            <li><HomeIcon /></li>
            <li><Link to="/employer/jobs">My Jobs</Link></li>
            <li><Link to="/employer/applications">Applications</Link></li>
            <li><Link to="/post-job">Post A Job</Link></li>
            <li><Link to="/employer/profile">Profile</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        <div className="header">
          <h2>Dashboard</h2>
          <div className="profile-section">
            <div className="profile-pic" />
            <div className="dropdown">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">▼</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <h2>Active Jobs ({jobs.length})</h2>
        <div className="job-cards-container">
          {jobs.length > 0 ? (
            jobs.map(job => (
              job && (
                <div key={job._id} className="job-card">
                  <h2>{job.title}</h2>
                  <p>{job.description}</p>
                  <p>Location: {job.location}</p>
                  <h4>{job.applications.length} Applications</h4>
                  {job.applications && job.applications.length > 0 ? (
                    <>
                      {applications.slice(0, 2).map(app => {
                        console.log('Application Data:', app); // Debugging line to confirm app._id existence
                        return (
                          <div key={app._id} className="application-card">
                            <p>
                              Applicant: {app.jobSeekerId.name}
                            </p>
                            <p>Status: {app.status}</p>
                            <p>Cover Letter: {app.coverLetter}</p>
                            <p>Expected Pay: {app.expectedPay}</p>
                            <button className="application-action-button accept-button" onClick={() => handleApplicationAction(app._id, 'accepted', job._id)}>Accept</button>
                            <button className="application-action-button reject-button" onClick={() => handleApplicationAction(app._id, 'rejected', job._id)}>Reject</button>
                          </div>
                        );
                      })}
                      {job.applications.length > 2 && (
                        <Link to={`/employer/applications/${job._id}`}>
                          <button className="view-applications-button">View All Applications</button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <p>No applications yet.</p>
                  )}
                  <Link to={`/employer/applications/${job._id}`}>
                    <button className="view-applications-button">View Applications</button>
                  </Link>
                </div>
              )
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
