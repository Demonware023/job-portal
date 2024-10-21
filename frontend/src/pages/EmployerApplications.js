import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import './EmployerApplications.css';
import JobDetailsModal from '../components/JobDetailsModal'; // Import the custom modal

const EmployerApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false); // State for Job Details Modal

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
      fetchApplications(selectedJob._id);
    } else if (jobId) {
      fetchApplications(jobId);
    }
  }, [selectedJob, jobId]);

  // Function to fetch applications by job ID
  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(`/api/employers/applications/jobs/${jobId}/applications`, {
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
      setIsJobDetailsModalOpen(false); // Close the modal
    } else {
      setSelectedJob(job); // Select the new job
      setIsJobDetailsModalOpen(true); // Open the modal
      fetchApplications(job._id); // Fetch applications for the clicked job
    }
  };

  // Handle opening the job details modal
  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(true); // Open the job details modal
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
    <div className="applications-container">
      <h2>Your Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="job-list">
          {jobs.map((job) => (
            <div
              key={job._id}
              className={`job-card ${selectedJob && selectedJob._id === job._id ? 'selected' : ''}`}
              onClick={() => handleJobClick(job)}
            >
              <h3>{job.title}</h3>
              <p>Location: {job.location}</p>
              <p className="job-description">
                {job.description.length > 100 ? `${job.description.slice(0, 100)}...` : job.description}
              </p>
              <h4>Applications: {applications.filter((app) => app.jobId === job._id).length}</h4>
              <button onClick={() => handleJobClick(job)}>View Applications</button>
              <button onClick={() => handleViewJobDetails(job)}>View Job Details</button> {/* New button for job details */}
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}

      {selectedJob || jobId ? (
        <>
          <h2>Applications for {selectedJob ? selectedJob.title : `Job ID: ${jobId}`}</h2>
          {applications.length > 0 ? (
            applications.map((app) =>
              app && app.jobSeekerId ? (
                <div key={app._id} className="application-card">
                  <p>Status: {app.status}</p>
                  <p>Applicant: {`${app.jobSeekerId.name} (${app.jobSeekerId.email})`}</p>
                  <p>Cover Letter: {app.coverLetter || 'No cover letter provided.'}</p>
                  <p>Expected Pay: {app.expectedPay || 'N/A'}</p>
                  <button onClick={() => handleApplicationAction(app._id, 'accepted')}>Accept</button>
                  <button onClick={() => handleApplicationAction(app._id, 'rejected')}>Reject</button>
                </div>
              ) : null
            )
          ) : (
            <p>No applications found for this job.</p>
          )}
        </>
      ) : (
        <p>Please select a job to view its applications.</p>
      )}

      {/* Job Details Modal */}
      {isJobDetailsModalOpen && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setIsJobDetailsModalOpen(false)} // Close modal function
        />
      )}
    </div>
  );
};

export default EmployerApplications;