const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'No token, access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.log('Invalid token');
            return res.status(403).json({ error: 'Invalid token' });
        }
        
        // Check role and assign data
        if (decodedToken.role === 'employer') {
            req.employer = decodedToken;
            console.log('Authenticated employer:', decodedToken);
        } else {
            req.user = decodedToken;
            console.log('Authenticated user:', decodedToken);
        }
        next();
    });
};

// Middleware to check if user is authenticated (general authentication)
const authenticateUser = (req, res, next) => {
    if (!req.user) {
        console.log('Access denied, not a Jobseeker');
        return res.status(401).json({ msg: 'Not authenticated' });
    }
    console.log('Jobseeker authenticated');
    next();
};

// Middleware to check if an employer is authenticated
const authenticateEmployer = (req, res, next) => {
    if (!req.employer) {
        console.log('Access denied, not an employer');
        return res.status(403).json({ msg: 'Access denied' });
    }
    console.log('Employer authenticated');
    next();
};

// Export the middleware
module.exports = {
    authenticateToken,
    authenticateUser,
    authenticateEmployer,
};