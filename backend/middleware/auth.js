const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token, access denied' }); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' }); // Forbidden
        req.user = user; // Store user data in req.user
        next();
    });
};

// Middleware to check if user is authenticated (general authentication)
const authenticateUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ msg: 'Not authenticated' });
    }
    next();
};

// Middleware to authenticate employers
const authenticateEmployer = (req, res, next) => {
    // Check if the user is logged in and is an employer
    if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

// Middleware to authenticate job seekers
const isJobSeeker = (req, res, next) => {
    if (req.user.role !== 'jobseeker') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

// Middleware to check if user is an employer
const isEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

// Export the middleware
module.exports = {
    authenticateToken,
    authenticateUser,
    authenticateEmployer,
    isJobSeeker,
    isEmployer,
};