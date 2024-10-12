// routes/jobSeekerRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateUser } = require('../middleware/auth');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');

// Apply for a job (Job Seeker)
router.post('/api/jobs/:jobId/apply', authenticateToken, async (req, res) => {
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
      status: 'pending',
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
router.get('/api/jobseeker/applied-jobs', authenticateUser, async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobSeekerId: req.user.id });
    if (!applications.length) return res.status(404).json({ msg: 'No applications found.' });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update job application status (Employer)
router.patch('/api/jobs/:jobId/applications/:appId', authenticateToken, async (req, res) => {
  const { jobId, appId } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const application = job.applications.id(appId);
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    application.status = status;
    await job.save();

    res.status(200).json({ msg: `Application ${status}` });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch job applications for the logged-in job seeker
router.get('/api/jobseeker/my-applications', authenticateToken, authenticateUser, async (req, res) => {
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

// Export the router
module.exports = router;
