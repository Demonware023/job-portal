import React from 'react';
import './SlideUpModal.css';

const SlideUpModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="slide-up-modal-overlay">
      <div className="slide-up-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="modal-content">
          <div className="profile-section">
            <img 
              src={application.jobSeekerId?.avatar || '../images/portal.jpg'} 
              alt={`${application.jobSeekerId?.name || 'Unknown'}'s profile`} 
              className="profile-image" 
            />
            <h2 className="applicant-name">{application.jobSeekerId?.name || 'Unknown Applicant'}</h2>
          </div>
          <div className="cover-letter-section">
            <h3>Cover Letter</h3>
            <p>{application.coverLetter || 'No cover letter provided.'}</p>
          </div>
          {/* Include any other details here */}
        </div>
      </div>
    </div>
  );
};

export default SlideUpModal;
