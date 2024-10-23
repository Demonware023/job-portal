import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployersJobsPage.css';

const EmployersJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/employer/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to the login page after logging out
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`/api/employer/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(jobs.filter(job => job._id !== jobId));
      setIsDeleteModalOpen(false); // Close the delete modal after deletion
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Handle modal open and setting the selected job
  const handleUpdateJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Handle job update
  const handleJobUpdate = async (updatedJob) => {
    try {
      const response = await axios.put(`/api/employer/jobs/${updatedJob._id}`, updatedJob, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(jobs.map(job => (job._id === response.data._id ? response.data : job))); // Update the job in the list
      setIsModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  // Open the delete confirmation modal
  const confirmDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="employer-jobs-page">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/employer/jobs">My Jobs</Link></li>
            <li><Link to="/employer/applications">Applications</Link></li>
            <li><Link to="/post-job">Post Job</Link></li>
            <li><Link to="/employer/profile">Profile</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        <h2>Your Jobs</h2>
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Location: {job.location}</p>
              <div className="job-actions">
                <button className="update-job-button" onClick={() => handleUpdateJob(job)}>Update Job</button>
                <button 
                  className="delete-job-button" 
                  onClick={() => confirmDeleteJob(job._id)} // Use confirmDeleteJob
                >
                  Delete Job
                </button>
              </div>
              <Link to={`/employer/applications/${job._id}`}>
                <button className="view-applications-button">View Applications</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Update Job</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleJobUpdate(selectedJob);
            }}>
              <input
                type="text"
                name="title"
                value={selectedJob?.title || ''}
                onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
                placeholder="Job Title"
                required
              />
              <textarea
                name="description"
                value={selectedJob?.description || ''}
                onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })}
                placeholder="Job Description"
                required
              />
              <input
                type="text"
                name="location"
                value={selectedJob?.location || ''}
                onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
                placeholder="Location"
                required
              />
              <input
                type="number"
                name="pay"
                value={selectedJob?.pay || ''}
                onChange={(e) => setSelectedJob({ ...selectedJob, pay: e.target.value })}
                placeholder="Pay"
                required
              />
              <button type="submit">Update Job</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</span>
            <h2>Are you sure you want to delete this job?</h2>
            <div className="modal-actions">
              <button className="delete-job-button" onClick={() => handleDeleteJob(jobToDelete)}>Yes</button>
              <button className="cancel-button" onClick={() => setIsDeleteModalOpen(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployersJobsPage;
