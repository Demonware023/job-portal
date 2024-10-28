import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'; // Import Link and useParams
import SlideUpModal from '../components/SlideUpModal';
import './EmployerApplicants.css'; // Create this file for styling

const EmployerApplicants = () => {
  const { jobId } = useParams(); // Get jobId from URL params
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  // Fetch applications based on jobId from params
  useEffect(() => {
    const fetchApplications = async (jobId) => {
      try {
        const response = await axios.get(`/api/employer/jobs/${jobId}/applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // Set loading to false in finally
      }
    };

    if (jobId) {
      fetchApplications(jobId);
    }
  }, [jobId]);

  const handleApplicationClick = (application) => {
    console.log('Selected Application:', application); // Log the application data
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Handle application status updates using the existing route
  const handleApplicationAction = async (appId, status) => {
    try {
      const response = await axios.patch(`/api/employer/jobs/${jobId}/applications/${appId}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(response.data.msg);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );
    } catch (error) {
      alert('Failed to update application status.');
    }
  };

  return (
    <div className="employer-applicants-container">
      <Link to="/employer/applications" className="back-button">
        &larr; Back to Jobs
      </Link>
      <h2>Applicants</h2>
      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : applications.length > 0 ? (
        <div className="applications-stack">
          {applications.map((app) => (
            <div key={app._id} className="application-card" onClick={() => handleApplicationClick(app)}>
              <div className="avatar-area">
                <img src={app.jobSeekerId?.avatar || '../images/portal.jpg'} alt="Applicant" />
              </div>
              <div className="details-area">
                <h3>{app.jobSeekerId ? app.jobSeekerId.name : 'Unknown Applicant'}</h3>
                <p>Status: {app.status}</p>
                <p>Email: {app.jobSeekerId?.email || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No applications found.</p>
      )}

      {isModalOpen && selectedApplication && (
        <SlideUpModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          application={selectedApplication} 
          onAccept={() => handleApplicationAction(selectedApplication._id, 'accepted')} 
          onReject={() => handleApplicationAction(selectedApplication._id, 'rejected')} 
        >
          <h2>Application Details</h2>
          <p><strong>Applicant Name:</strong> {selectedApplication.jobSeekerId?.name || 'Unknown'}</p>
          <p><strong>Email:</strong> {selectedApplication.jobSeekerId?.email || 'N/A'}</p>
          <p><strong>Cover Letter:</strong> {selectedApplication.coverLetter}</p>
          <p><strong>Expected Pay:</strong> {selectedApplication.expectedPay}</p>
        </SlideUpModal>
      )}
    </div>
  );
};

export default EmployerApplicants;
