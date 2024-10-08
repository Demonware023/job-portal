// backend/app.js
const express = require('express');
const connectDB = require('./config/db'); // Database connection function
const cors = require('cors'); // CORS middleware for cross-origin requests
const authRoutes = require('./routes/auth'); // Authentication routes
const errorHandler = require('./middleware/errorHandler'); // Import the error handler
const jobRoutes = require('./routes/jobs'); // Import the job routes
require('dotenv').config(); // Load environment variables


// Initialize Express App
const app = express();

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
app.use('/api/jobs', jobRoutes); // Use the job routes
app.use('/api/auth', authRoutes.router); // Auth routes - Ensure you are using the router from auth.js

// Use error handling middleware
app.use(errorHandler);

module.exports = app;