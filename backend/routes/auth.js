// For handing authentication
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting: Limit to 100 requests per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many login attempts, please try again later.' },
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: { msg: 'Too many registration attempts, please try again later.' },
});

// Register a new user
router.post('/register', registerLimiter, async (req, res) => {
    const { name, email, password, role } = req.body; // Include 'role' in the request body
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Hash the password and save the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role: role || 'user' }); // Set the role, or default to 'user'
        await user.save();

        // Create a JWT token for the new user
        const payload = { userId: user.id, role: user.role };
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
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' }); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' }); // Forbidden
        req.user = user; // Store user data in req.user
        next();
    });
};

// Get welcome message
router.get('/home', (req, res) => {
    res.json({ message: 'Welcome to the Job Board!' });
});

// Get list of available jobs
router.get('/jobs', (req, res) => {
    const jobs = [
        { id: 1, title: 'Software Engineer', company: 'META' },
        { id: 2, title: 'Product Manager', company: 'Google' },
        // Add more jobs as necessary
    ];
    res.json({ jobs });
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ profile: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Export the middleware along with the router
module.exports = {
    router,
    authenticateToken,
};