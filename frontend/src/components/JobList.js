import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobList.css';  // Style for job listing

const JobList = ({ searchTerm }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch job listings, optionally filter by searchTerm
    axios.get('/api/jobs')
      .then(response => {
        if (searchTerm) {
          const filteredJobs = response.data.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setJobs(filteredJobs);
        } else {
          setJobs(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching job listings:', error);
      });
  }, [searchTerm]);

  return (
    <div className="job-list">
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="job-item">
            <h3>{job.title}</h3>
            <p>{job.companyName}</p>
            <p>{job.location}</p>
            <button>Apply Now</button>
          </div>
        ))
      )}
    </div>
  );
};

export default JobList;
