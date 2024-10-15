// routes/jobSeekerRoutes.js
const express = require('express');
const router = express.Router();
const { registerJobSeeker, getJobSeekerProfile } = require('../controllers/jobSeekerController');
const { authenticateToken, authenticateUser } = require('../middleware/auth');
const JobApplication = require('../models/jobApplication');
const Job = require('../models/Job');

// POST route for registering a job seeker
router.post('/', registerJobSeeker);

// GET route for retrieving a job seeker profile by user ID
router.get('/:id', authenticateUser, getJobSeekerProfile);

// POST /api/jobs/:jobId/apply - Apply for a job (restricted to authenticated users)
router.post('/jobs/:jobId/apply', authenticateToken, async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter, expectedPay, resume } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const application = {
      userId: req.user.id,
      coverLetter,
      expectedPay,
      resume,
      status: 'pending', // Default status for new applications
    };

    job.applications.push(application);
    await job.save();

    res.status(200).json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all applied jobs for a job seeker
router.get('/jobseeker/applied-jobs', authenticateUser, async (req, res) => {
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
router.get('/jobseeker/my-applications', authenticateToken, authenticateUser, async (req, res) => {
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

// Export the router
module.exports = router;
