// For handing authentication
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employer = require('../models/Employer'); // For employers
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

// Define your routes
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Home page' });
});

// Register a new jobseeker
router.post('/register-jobseeker', registerLimiter, async (req, res) => {
    const { name, email, password } = req.body; // role defaults to 'jobseeker'
    
    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password and save the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Create JWT payload
        const payload = { id: user.id, role: user.role };

        // Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'Job seeker registered successfully' });
    } catch (err) {
        console.error('Error during job seeker registration:', err);
        res.status(500).json({ msg: 'Server error during job seeker registration' });
    }
});

// Register a new employer
router.post('/register-employer', registerLimiter, async (req, res) => {
    const { companyName, email, password } = req.body;

    try {
        // Validate input
        if (!companyName || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }

        // Check if employer already exists
        let employer = await Employer.findOne({ email });
        if (employer) {
            return res.status(400).json({ msg: 'Employer already exists' });
        }

        // Create new employer
        employer = new Employer({ companyName, email, password }); // role defaults to 'employer'
        await employer.save();

        // Create JWT payload
        const payload = { id: employer.id, role: employer.role };

        // Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'Employer registered successfully' });
    } catch (err) {
        console.error('Error during employer registration:', err);
        res.status(500).json({ msg: 'Server error during employer registration' });
    }
});  


// Login Job Seeker
router.post('/login-jobseeker', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = { id: user.id, role: 'jobSeeker' }; // Use the user's role from the database

        // Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with token and user role
        res.json({ token, role: 'jobSeeker', message: 'Login successful' });
    } catch (err) {
        console.error('Error during job seeker login:', err.message);
        res.status(500).send('Server error');
    }
});

// Login Employer
router.post('/login-employer', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const employer = await Employer.findOne({ email });
        if (!employer) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { id: employer.id, role: 'employer' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: 'employer', message: 'Login successful' });
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