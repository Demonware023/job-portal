// src/JobSeekerJobsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JobSeekerJobsPage.css'; // Optional: Add your CSS for styling

const JobSeekerJobsPage = () => {
  const navigate = useNavigate(); // Correctly calling useNavigate within the component
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // Define selectedJob state

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobseeker/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (err) {
        setError('Error fetching jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const closeModal = () => {
    setSelectedJob(null); // Close the modal
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job); // Set the selected job to show in modal
  };

  const handleApply = (jobId) => {
    navigate(`/job-application/${jobId}`); // Navigate to job application page
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="job-seeker-jobs-page">
      <h1>Available Jobs</h1>
      {jobs.length > 0 ? (
        jobs.map(job => (
          <div key={job._id} className="job-card">
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Location: {job.location}</p>
            <button onClick={() => handleApply(job._id)}>Apply Now</button>
            <button onClick={() => handleViewDetails(job)}>View Details</button> {/* Add a button to view details */}
          </div>
        ))
      ) : (
        <p>No jobs available at the moment.</p>
      )}
      {selectedJob && (
        <div className="modal">
          <h2>{selectedJob.title}</h2>
          <p>{selectedJob.description}</p>
          <p>Location: {selectedJob.location}</p>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default JobSeekerJobsPage;