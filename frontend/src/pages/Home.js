// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FaBriefcase, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the welcome message from the backend
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/home'); // Assume your backend has this route
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching home message:', error);
        setMessage('Failed to load message');
      }
    };

    fetchMessage();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, boxShadow: 3 }}>
        <Typography variant="h6" color="primary">
          JobBoard
        </Typography>
        <Box>
          <Link to="/login">
            <Button sx={{ mr: 2 }} color="inherit">
              Login
            </Button>
          </Link>
          <Link to="/register-jobseeker">
            <Button variant="contained" color="primary">
              Sign Up
            </Button>
          </Link>
        </Box>
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
          {message}
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
          <Link to="/jobs">
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