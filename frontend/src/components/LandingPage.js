import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FaBriefcase, FaUserTie } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, boxShadow: 3 }}>
        <Typography variant="h6" color="primary">
          JobBoard
        </Typography>
        <Box>
          <Button sx={{ mr: 2 }} color="inherit">
            Login
          </Button>
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
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
          backgroundImage: 'url(/path-to-hero-image.jpg)',
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
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<FaBriefcase />}
            sx={{ mr: 2 }}
          >
            Post a Job
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            startIcon={<FaUserTie />}
          >
            Find a Job
          </Button>
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

export default LandingPage;