// For handing authentication
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employer = require('../models/Employer'); // Employer model
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Rate limiting: Limit to 100 requests per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many login attempts, please try again later.' },
});

// Rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: { msg: 'Too many registration attempts, please try again later.' },
});

// Register a new user
router.post('/register', registerLimiter, async (req, res) => {
    const { name, email, password, role } = req.body; // Include 'role' in the request body
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Hash the password and save the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role: role || 'JobSeeker' }); // Set the role, or default to 'user'
        await user.save();

        // Create a JWT token for the new user
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login a user
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create a JWT token
        const payload = { id: user.id, role: user.role };// Include role in the payload
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get welcome message
router.get('/home', (req, res) => {
    res.json({ message: 'Welcome to the Job Board!' });
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ profile: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Export the router
module.exports = router;