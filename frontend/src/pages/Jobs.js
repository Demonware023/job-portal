import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <h3>{job.title} at {job.company}</h3>
            <p>{job.description}</p>
            <p>Location: {job.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Jobs;
