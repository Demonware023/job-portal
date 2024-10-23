// src/components/Footer.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './Footer.css';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5', // light background
        color: '#333', // dark text color
        borderTop: '1px solid #ccc',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Are you an employer?
      </Typography>
      <Typography variant="body1" gutterBottom>
        Workable has helped companies hire millions with its leading software.
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Box>
  );
};

export default Footer;