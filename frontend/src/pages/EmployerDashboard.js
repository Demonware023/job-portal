import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchApplications = async () => {
      try {
        // Fetch applications for the jobs listed by the employer
        const response = await axios.get('/api/applications', {
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

  const handleApplicationAction = async (jobId, appId, status) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}/applications/${appId}`, { status });
      alert(response.data.msg);
      // Refresh the applications after updating status
      const updatedApplications = applications.map((app) => 
        app._id === appId ? { ...app, status } : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      alert('Failed to update application status.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Jobs</h2>
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
                  <p>Applicant: {app.userId}</p>
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

      {/* Add a link to post a job */}
      <Link to="/post-job">
        <button className="post-job-button">Post Job</button>
      </Link>

      <h2>All Applications</h2>
      {applications.length > 0 ? (
        applications.map(app => (
          <div key={app._id} className="application-card">
            <h3>{app.job.title}</h3>
            <p>Status: {app.status}</p>
          </div>
        ))
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default EmployerDashboard;