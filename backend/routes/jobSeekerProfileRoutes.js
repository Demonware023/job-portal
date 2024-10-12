// routes/jobSeekerProfileRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth'); // Adjust the import path if needed
const JobSeekerProfile = require('../models/JobSeekerProfile'); 
const Job = require('../models/Job');

// Update job seeker profile
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

// Get job seeker profile
router.get('/api/jobseeker/profile', authenticateUser, async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found.' });
    
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get recommended jobs based on profile skills
router.get('/api/jobseeker/recommended-jobs', authenticateUser, async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile || !profile.skills.length) return res.status(400).json({ msg: 'No skills found in profile' });

    const recommendedJobs = await Job.find({
      skills: { $in: profile.skills },
    });
    res.json({ recommendedJobs });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;