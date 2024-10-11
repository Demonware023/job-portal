const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateUser } = require('../middleware/auth'); // Adjust the import path if needed
const JobApplication = require('../models/JobApplication'); // Adjust the import path if needed
const JobSeekerProfile = require('../models/JobSeekerProfile'); // Ensure you have the JobSeekerProfile model imported
const Job = require('../models/Job'); // Ensure you have the Job model imported

// POST /api/jobseeker/profile
router.post('/api/jobseeker/profile', authenticateUser, async (req, res) => {
    const { bio, skills, experience, resumeUrl } = req.body;

    try {
        const profile = await JobSeekerProfile.findOneAndUpdate(
            { userId: req.user.id },
            { bio, skills, experience, resumeUrl },
            { new: true, upsert: true }
        );
        res.json({ msg: 'Profile updated successfully', profile });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/jobseeker/profile
router.get('/api/jobseeker/profile', authenticateUser, async (req, res) => {
    try {
        const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found.' });
        }
        res.json({ profile });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/jobseeker/recommended-jobs
router.get('/api/jobseeker/recommended-jobs', authenticateUser, async (req, res) => {
    try {
        const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
        if (!profile || !profile.skills.length) {
            return res.status(400).json({ msg: 'No skills found in profile' });
        }

        // Find jobs that match the user's skills
        const recommendedJobs = await Job.find({
            skills: { $in: profile.skills },
        });
        res.json({ recommendedJobs });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Example protected route for job seekers to fetch their applications
router.get('/my-applications', authenticateToken, authenticateUser, async (req, res) => {
    try {
        // Fetch job applications for the logged-in user
        const applications = await JobApplication.find({ jobSeekerId: req.user.id }); // Adjust the field based on your JobApplication model
        
        if (!applications.length) {
            return res.status(404).json({ msg: 'No applications found.' });
        }
        
        res.status(200).json(applications); // Respond with the applications found
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ msg: 'Server error' }); // Respond with a server error
    }
});

// Export the router
module.exports = router;