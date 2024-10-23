import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FaBriefcase, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Ensure this is imported
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1); // Page state
  const [totalPages, setTotalPages] = useState(0); // Total pages state

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/jobseeker/jobs?page=${page}&limit=10`);
        setJobs((prevJobs) => [...prevJobs, ...response.data.jobs]); // Append new jobs to existing ones
        setTotalPages(response.data.totalPages); // Update total pages
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [page]); // Fetch jobs whenever the page changes

  // Load more jobs when the button is clicked
  const loadMoreJobs = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 4 }}>
      {/* Button Section as part of the main page */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, boxShadow: 3, padding: 2, backgroundColor: '#fff', borderRadius: 2 }}>
        <Button component={Link} to="/login" sx={{ mx: 2 }} variant="contained" color="primary" startIcon={<FaUserTie />}>
          Login
        </Button>
        <Button component={Link} to="/register-employer" sx={{ mx: 2 }} variant="contained" color="primary" startIcon={<FaUserTie />}>
          Register Employer
        </Button>
        <Button component={Link} to="/register-jobseeker" sx={{ mx: 2 }} variant="contained" color="primary" startIcon={<FaUserTie />}>
          Register Jobseeker
        </Button>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
          backgroundImage: 'url(/path-to-hero-image.jpg)', // Replace with actual image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: 4,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to the Tech Job Board
        </Typography>
        <Typography variant="h6" gutterBottom>
          Find your next tech job or hire the best talent in the industry.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {/* Add your message here */}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link to="/post-job">
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<FaBriefcase />}
              sx={{ mr: 2 }}
            >
              Post a Job
            </Button>
          </Link>
          <Link to="/jobseeker/jobs">
            <Button
              variant="outlined"
              size="large"
              color="primary"
              startIcon={<FaUserTie />}
            >
              Find a Job
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Job Listings Section */}
      <Box className="jobs-list">
        <Typography variant="h5" sx={{ mb: 2 }}>
          Latest Jobs
        </Typography>
        <Box>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <Box key={index} className="job-item" sx={{ borderBottom: '1px solid #ccc', mb: 3, pb: 2 }}>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2">{job.location}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 1 }} startIcon={<FaUserTie />}>
                  Apply Now
                </Button>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No jobs available at the moment.</Typography>
          )}
        </Box>

        {/* Load More Button */}
        {page < totalPages && (
          <Button variant="contained" color="primary" onClick={loadMoreJobs} sx={{ mt: 4 }}>
            Load More Jobs
          </Button>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.900', color: 'white' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} JobBoard. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
