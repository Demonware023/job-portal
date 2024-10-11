// src/pages/RecommendedJobs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      const response = await axios.get('/api/jobseeker/recommended-jobs');
      setJobs(response.data.recommendedJobs);
    };
    fetchRecommendedJobs();
  }, []);

  return (
    <div>
      <h2>Recommended Jobs</h2>
      {jobs.length ? (
        <div>
          {jobs.map((job) => (
            <div key={job._id}>
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <p><strong>Skills Required:</strong> {job.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found based on your skills.</p>
      )}
    </div>
  );
};

export default RecommendedJobs;