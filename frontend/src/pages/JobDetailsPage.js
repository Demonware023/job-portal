import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './JobDetailsPage.css'; // Optional: Add CSS for styling

const JobDetailsPage = () => {
  const { jobId } = useParams(); // Get the job ID from the route params
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [autofillSuccess, setAutofillSuccess] = useState(true); // Simulate autofill success

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobseeker/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err); // Log the error for debugging
        setError('Error fetching job details.');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApplyClick = () => {
    setShowModal(true); // Open the modal when applying
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="job-details-page">
      {job && (
        <>
          <h1>{job.title}</h1>
          <p>{job.description}</p>
          <p>Location: {job.location}</p>
          <p>Company: {job.companyName}</p>
          <img src={job.companyLogo} alt={`${job.companyName} Logo`} className="company-logo" />

          <button onClick={handleApplyClick}>Apply Now</button>

          {/* Modal for applying */}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Apply for {job.title} (REMOTE)</h2>
                <p>at {job.companyName}</p>
                {autofillSuccess && (
                  <div className="autofill-success">
                    <span role="img" aria-label="Success">😊</span> Part of this application is autofilled. Please review your information.
                  </div>
                )}

                {/* Import Resume Section */}
                <div className="autofill-section">
                  <label>Autofill Application</label>
                  <button className="import-button">Import resume from ▼</button>
                </div>

                {/* Personal Information Form */}
                <div className="personal-info">
                  <label>Personal information</label>
                  <div className="form-group">
                    <label>First name</label>
                    <input type="text" value="Chimere" readOnly />
                  </div>
                  <div className="form-group">
                    <label>Last name</label>
                    <input type="text" value="Awam" readOnly />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="modal-footer">
                  <button className="cancel-button" onClick={closeModal}>Cancel</button>
                  <button className="submit-button">Submit application</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;
