import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import JobDetailsModal from '../components/JobDetailsModal';
import HomeIcon from '../components/HomeIcon';
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicantId, setApplicantId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [selectedJob, setSelectedJob] = useState(null); // State for selected job
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setApplicantId(decodedToken.id);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };
    getUserInfo();
  }, []); // Run only once to get the user info

  useEffect(() => {
    const fetchApplications = async () => {
      if (applicantId) {
        try {
          const response = await axios.get(`/api/jobseeker/my-applications`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setApplications(response.data);
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      }
    };

    fetchApplications();
  }, [applicantId]); // Re-fetch applications when applicantId is available

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/jobseeker/jobs?page=${page}&limit=10`);
        setJobs((prevJobs) => [...prevJobs, ...response.data.jobs]); // Append new jobs to existing ones
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [page]); // Fetch jobs whenever the page changes

  const loadMoreJobs = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to the login page after logging out
  };
  
  const handleViewDetails = (job) => {
    setSelectedJob(job); // Set the selected job to show in modal
  };

  const handleApply = (jobId) => {
    navigate(`/job-application/${jobId}`);
  };

  const closeModal = () => {
    setSelectedJob(null); // Close the modal
  };

  // Create a Set to track unique job IDs
  const uniqueJobIds = new Set();

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><HomeIcon /></li>
            <li><Link to="/jobseeker/jobs">Available Jobs</Link></li>
            <li><Link to="/jobseeker/profile">Profile</Link></li>
            <li><Link to="/jobseeker/settings">Settings</Link></li>
            <li><Link to="/jobseeker/application">My Applications</Link></li>
            <li><Link to="/jobseeker/recommended-jobs">Recommended Jobs</Link></li>
            <li><Link to="/jobseeker/jobs/:jobId">JobDetailsPage</Link></li>
          </ul>
        </nav>
        {/* Job Time Portal Icon */}
        <div className="portal-icon">
          <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="portalEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                <feComponentTransfer>
                  <feFuncA type="table" tableValues="0 1" />
                </feComponentTransfer>
              </filter>
            </defs>

            <g className="portal">
              <circle cx="100" cy="100" r="60" fill="purple" filter="url(#portalEffect)" />
              <path
                d="M100,40 Q120,80 100,120 Q80,80 100,40"
                fill="none"
                stroke="white"
                strokeWidth="4"
              />
            </g>

            <g className="character">
              <rect
                x="90"
                y="130"
                width="20"
                height="40"
                fill="brown"
                className="briefcase"
              />
              <circle cx="100" cy="110" r="10" fill="blue" />
            </g>

            <style>
              {`
                @keyframes runThroughPortal {
                  0% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                  50% {
                    transform: translateX(30px);
                    opacity: 0.5;
                  }
                  100% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }

                .character {
                  animation: runThroughPortal 2s linear infinite;
                }

                .portal {
                  animation: spin 2s linear infinite;
                }

                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>
          </svg>
        </div>
      </aside>

      <div className="main-content">
        <div className="header">
          <h1>Your Applications</h1>
          <div className="profile-dropdown" onClick={toggleDropdown}>
            <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
            {dropdownOpen && (
              <div className="dropdown-content">
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            )}
          </div>
        </div>
        
        <h2>Your Applications</h2>
        <div className="job-cards-container">
          {applications.length > 0 ? (
            applications.map(app => (
              app.job && (
                <div key={app._id} className="jobseeker-application-card">
                  <h3>{app.job.title}</h3>
                  <p>Status: {app.status}</p>
                  <p>Cover Letter: {app.coverLetter}</p>
                  <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                </div>
              )
            ))
          ) : (
            <p>No applications found.</p>
          )}
        </div>
        
        <h2>Available Jobs</h2>
        <div className="job-cards-container">
          {jobs.length > 0 ? (
            jobs.filter(job => {
              // Check if the job ID is already in the Set
              if (!uniqueJobIds.has(job._id)) {
                uniqueJobIds.add(job._id); // Add it to the Set if it's unique
                return true; // Include this job
              }
              return false; // Exclude this job (duplicate)
            }).map(job => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <p>Location: {job.location}</p>
                <button onClick={() => handleViewDetails(job)}>View Details</button>
                <button onClick={() => handleApply(job._id)} className="apply-button">Apply Now</button>
              </div>
            ))
          ) : (
            <p>No jobs available.</p>
          )}
        </div>

        {/* Load more button */}
        {page < totalPages && (
          <button onClick={loadMoreJobs}>Load More</button>
        )}
      </div>

      {/* Modal for job details */}
      <JobDetailsModal job={selectedJob} onClose={closeModal} />
    </div>
  );
};

export default JobSeekerDashboard;