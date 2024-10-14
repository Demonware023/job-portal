// backend/app.js
const express = require('express');
const connectDB = require('./config/db'); // Database connection function
const cors = require('cors'); // CORS middleware for cross-origin requests
const authRoutes = require('./routes/auth'); // Authentication routes
const errorHandler = require('./middleware/errorHandler'); // Import the error handler
// const jobRoutes = require('./routes/jobs'); // Import the job routes
const employerRoutes = require('./routes/employer');
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');
const jobSeekerProfileRoutes = require('./routes/jobSeekerProfileRoutes');
require('dotenv').config(); // Load environment variables

// console.log("JWT Secret:", process.env.JWT_SECRET);
// console.log('Job Routes:', jobRoutes); // This should not be undefined
// console.log('Employer Routes:', employerRoutes); // This should not be undefined
// console.log('Auth Routes:', authRoutes); // Should not be undefined
// console.log('Job Seeker Routes:', jobSeeker); // This should not be undefined
// console.log('Job Seeker Profile Routes:', jobSeekerProfileRoutes); // This should not be undefined

// Initialize Express App
const app = express();

// app.set('trust proxy', true);

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for frontend-backend communication

// Basic Route
app.get('/', (req, res) => {
  res.send('Job Board Backend is Up & Running');
});

// Connect to the database
connectDB(); // Call MongoDB connection function

// Routes
// app.use('/api/jobs', jobRoutes); // Use the job routes
app.use('/api/auth', authRoutes); // Auth routes - Ensure you are using the router from auth.js
app.use('/api/employer', employerRoutes);
app.use('/api/jobseekerRoutes', jobSeekerRoutes); // Routes for job seeker applications
app.use('/api/jobseeker/profile', jobSeekerProfileRoutes); // Routes for job seeker profiles and recommendations

// Use error handling middleware
app.use(errorHandler);



module.exports = app;