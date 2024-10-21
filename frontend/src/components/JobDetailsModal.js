import React from 'react';
import './JobDetailsModal.css'; // Import the CSS for styling

const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{job.title}</h2>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Company:</strong> {job.companyName}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Requirements:</strong> {job.requirements ? job.requirements.join(', ') : 'N/A'}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default JobDetailsModal;