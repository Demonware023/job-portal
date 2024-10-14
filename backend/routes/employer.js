const express = require('express');
const { check, validationResult } = require('express-validator'); // Import express-validator
const { registerEmployer, getEmployerProfile } = require('../controllers/employerController');
const { authenticateEmployer, authenticateToken, authenticateUser, isEmployer } = require('../middleware/auth'); // Adjust import path if needed
const Employer = require('../models/Employer'); // Adjust import path if needed
const Job = require('../models/Job'); // Ensure the path to your Job model is correct
const router = express.Router();

// POST route for registering an employer
router.post('/', registerEmployer);

// GET route for retrieving an employer profile by ID
router.get('/:id', getEmployerProfile);

// GET route for retrieving an employer profile by ID
// router.get('/employer/:id', getEmployerProfile);

// PATCH /api/employer/profile
router.patch('/api/employer/profile', authenticateEmployer, authenticateToken, async (req, res) => {
    const { companyName, description } = req.body;
    try {
        const employer = await Employer.findByIdAndUpdate(req.user.id, { companyName, description }, { new: true });
        if (!employer) return res.status(404).json({ msg: 'Employer not found' });
        res.status(200).json(employer);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/employer/jobs
router.post(
    '/api/employer/jobs',
    [
        // Validation rules
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
        check('location').notEmpty().withMessage('Location is required'),
        check('pay').isNumeric().withMessage('Pay must be a number'),
    ],
    authenticateEmployer,
    authenticateToken,
    async (req, res) => {
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, location, pay } = req.body;
        try {
            const newJob = new Job({
                title,
                description,
                location,
                pay,
                employerId: req.user.id, // Employer who created the job
                applications: [],
            });

            await newJob.save();
            res.status(201).json({ msg: 'Job posted successfully', job: newJob });
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// Employer-only route to post a job
router.post('/api/jobs', authenticateUser, isEmployer, async (req, res) => {
    const { title, company, description, location } = req.body;
    try {
        const job = new Job({ title, company, description, location, employerId: req.user.id });
        await job.save();
        res.status(201).json({ job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Employer-only route to fetch jobs posted by employer
router.get('/api/employer/jobs', authenticateUser, isEmployer, async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user.id }); // Fetch jobs by the logged-in employer
        res.status(200).json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Export the router
module.exports = router;