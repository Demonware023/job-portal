// routes/jobSeekerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const { registerJobSeeker, getJobSeekerProfile } = require('../controllers/jobSeekerController');
const { authenticateToken, authenticateUser } = require('../middleware/auth');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// POST route for registering a job seeker
// router.post('/', registerJobSeeker);

// GET route for retrieving a job seeker profile by user ID
// router.get('/:id', authenticateUser, getJobSeekerProfile);

// POST /api/jobs/:jobId/apply - Apply for a job (restricted to authenticated users)
router.post('/jobs/:jobId/apply', authenticateToken, async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter, expectedPay, resume } = req.body;

  try {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ msg: 'Job not found' });

      // Create a new job application
      const application = new JobApplication({
          jobSeekerId: req.user.id, // Use the authenticated user's ID
          jobId: jobId,
          coverLetter,
          expectedPay,
          resume,
          status: 'pending', // Default status for new applications
      });

      // Save the application
      await application.save();

      // Add the application ID to the job's applications array
      job.applications.push(application._id);
      await job.save();

      res.status(200).json({ msg: 'Application submitted successfully' });
  } catch (err) {
      console.error('Error applying for job:', err);
      res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all applied jobs for a job seeker
router.get('/applied-jobs', authenticateUser, async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobSeekerId: req.user.id });
    if (!applications.length) return res.status(404).json({ msg: 'No applications found.' });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch job applications for the logged-in job seeker
router.get('/my-applications', authenticateToken, authenticateUser, async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobSeekerId: req.user.id });
    if (!applications.length) {
      return res.status(404).json({ msg: 'No applications found.' });
    }
    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all job postings with pagination support (For all users)
router.get('/jobs', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const jobs = await Job.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Job.countDocuments();
    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).send('Server error');
  }
});

// New Route: Fetch job details by job ID
router.get('/jobs/:jobId', authenticateUser, async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.status(200).json({ job });
  } catch (err) {
    console.error('Error fetching job details:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update job seeker profile
router.post('/profile', authenticateUser, async (req, res) => {
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
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found.' });
    
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get recommended jobs based on profile skills
router.get('/recommended-jobs', authenticateUser, async (req, res) => {
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

// Export the router
module.exports = router;
