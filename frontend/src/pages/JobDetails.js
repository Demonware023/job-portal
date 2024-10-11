// src/pages/JobDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedPay, setExpectedPay] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios.get(`/api/jobs/${jobId}`)
      .then(response => setJob(response.data))
      .catch(error => console.error('Error fetching job details:', error));
  }, [jobId]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('expectedPay', expectedPay);
    formData.append('resume', resume);

    try {
      const response = await axios.post(`/api/jobs/${jobId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.msg);
    } catch (error) {
      alert('Failed to apply. Try again.');
    }
  };

  return (
    <div>
      {job ? (
        <div>
          <h2>{job.title}</h2>
          <p>{job.description}</p>
          <p>Location: {job.location}</p>
          <p>Pay: {job.pay}</p>

          <h3>Apply for this job</h3>
          <form onSubmit={handleApplicationSubmit}>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Cover Letter"
              required
            />
            <input
              type="text"
              value={expectedPay}
              onChange={(e) => setExpectedPay(e.target.value)}
              placeholder="Expected Pay"
              required
            />
            <input
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
            <button type="submit">Submit Application</button>
          </form>
        </div>
      ) : (
        <p>Loading job details...</p>
      )}
    </div>
  );
};

export default JobDetails;