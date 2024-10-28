import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './EmployerApplications.css'; // Ensure this file is created for styling
import JobDetailsModal from '../components/JobDetailsModal'; // Import the custom modal
import HomeIcon from '../components/HomeIcon';

const EmployerApplications = () => {
/*   const { jobId } = useParams(); */
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false); // State for Job Details Modal
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state for profile

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/employer/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // Set loading to false in finally
      }
    };

    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to the login page after logging out
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
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
          <h2>Job Applications</h2>
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

        <div className="job-cards-container">
          {loading ? (
            <p>Loading jobs...</p> // Consider using a spinner here
          ) : error ? (
            <p className="error-message">{error}</p> // Display error message
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job._id} className="job-card">
                <h2>{job.title}</h2>
                <p>{job.description}</p>
                <p>Location: {job.location}</p>
                
                <div className="job-actions"> {/* Added action items container */}
                  <Link to={`/employer/jobs/${job._id}/applications`} className="delete-job-button">
                    View Applications
                  </Link>

                  <button 
                    onClick={() => {
                      setSelectedJob(job);
                      setIsJobDetailsModalOpen(true);
                    }}
                    className="update-job-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>

        {/* Job Details Modal */}
        {isJobDetailsModalOpen && selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => {
              setIsJobDetailsModalOpen(false);
              setSelectedJob(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerApplications;
