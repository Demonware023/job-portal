import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './EmployerApplications.css';
import JobDetailsModal from '../components/JobDetailsModal'; // Import the custom modal

const EmployerApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false); // State for Job Details Modal
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false); // State for Applications Modal

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/employer/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch applications based on selected job or jobId from params
  useEffect(() => {
    if (selectedJob) {
      setApplications(selectedJob.applications || []); // Use the applications from the selected job directly
    } else if (jobId) {
      fetchApplications(jobId);
    }
  }, [selectedJob, jobId]);

  // Function to fetch applications by job ID
  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(`/api/employers/jobs/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Handle job selection and toggle if the same job is clicked again
  const handleJobClick = (job) => {
    if (selectedJob && selectedJob._id === job._id) {
      setSelectedJob(null); // Unselect the job if it's already selected
      setIsJobDetailsModalOpen(false); // Close the job details modal
      setIsApplicationsModalOpen(false); // Close the applications modal
    } else {
      setSelectedJob(job); // Select the new job
      setIsJobDetailsModalOpen(false); // Ensure job details modal is closed
      setIsApplicationsModalOpen(true); // Open the applications modal
      fetchApplications(job._id); // Fetch applications for the clicked job
    }
  };

  // New function to handle View Applications button click
  const handleApplicationsClick = (job) => {
    if (isApplicationsModalOpen && selectedJob && selectedJob._id === job._id) {
      setSelectedJob(null); // Unselect the job if it's already selected
      setIsApplicationsModalOpen(false); // Close the applications modal
    } else {
      setSelectedJob(job); // Select the job
      setIsApplicationsModalOpen(true); // Open the applications modal
      fetchApplications(job._id); // Fetch applications for the job
    }
  };

  // Handle application status updates
  const handleApplicationAction = async (appId, status) => {
    try {
      const response = await axios.patch(`/api/employers/applications/${appId}`, { status });
      alert(response.data.msg);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );
    } catch (error) {
      alert('Failed to update application status.');
    }
  };


  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/employer/jobs">My Jobs</Link></li>
            <li><Link to="/employer/applications">Applications</Link></li>
            <li><Link to="/post-job">Post A Job</Link></li>
            <li><Link to="/employer/profile">Profile</Link></li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <div className="applications-container">
          <h2>Your Jobs</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              job && (
                <div key={job._id} className="job-card">
                  <h2 onClick={() => handleJobClick(job)}>{job.title}</h2>
                  <p>{job.description}</p>
                  <p>Location: {job.location}</p>

                  <button 
                    onClick={() => handleApplicationsClick(job)} 
                    className="view-applications-button"
                  >
                    View Applications
                  </button>

                  <button onClick={() => {
                    setSelectedJob(job);
                    setIsJobDetailsModalOpen(true);
                    setIsApplicationsModalOpen(false);
                  }}>
                    View Details
                  </button>
                </div>
              )
            ))
          ) : (
            <p>No jobs found.</p>
          )}

          {isApplicationsModalOpen && selectedJob && (
            <>
              <h2>Applications for {selectedJob.title}</h2>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app._id} className="application-card">
                    <p>
                      Applicant: {app.jobSeekerId ? `${app.jobSeekerId.name} (${app.jobSeekerId.email})` : 'Unknown Applicant'}
                    </p>
                    <p>Status: {app.status}</p>
                    <p>Cover Letter: {app.coverLetter}</p>
                    <p>Expected Pay: {app.expectedPay}</p>
                    <button onClick={() => handleApplicationAction(app._id, 'accepted')}>Accept</button>
                    <button onClick={() => handleApplicationAction(app._id, 'rejected')}>Reject</button>
                  </div>
                ))
              ) : (
                <p>No applications found for this job.</p>
              )}
            </>
          )}

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
    </div>
  );
};

export default EmployerApplications;