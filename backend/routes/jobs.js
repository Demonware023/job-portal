const express = require('express');
const { check, validationResult } = require('express-validator');

const Job = require('../models/Job');
const router = express.Router();

// Middleware to verify user role
const verifyRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient role' });
  }
  next();
};

// Job posting validation and creation (restricted to authenticated employers)
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('pay', 'Pay must be a valid number').isFloat(),
  ],
  authenticateToken,
  verifyRole('employer'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, description, location, pay } = req.body;
    try {
      const job = new Job({ title, company, description, location, pay });
      await job.save();
      res.status(201).json({ job });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get all job postings with pagination support
router.get('/', async (req, res) => {
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

// Update a job posting (restricted to authenticated employers)
router.put('/:id', authenticateToken, verifyRole('employer'), async (req, res) => {
  try {
    const { title, company, description, location, pay } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    job.title = title || job.title;
    job.company = company || job.company;
    job.description = description || job.description;
    job.location = location || job.location;
    job.pay = pay || job.pay;

    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).send('Server error');
  }
});

// Delete a job posting (restricted to authenticated employers)
router.delete('/:id', authenticateToken, verifyRole('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    await job.remove();
    res.json({ msg: 'Job removed' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).send('Server error');
  }
});

// Apply for a job (restricted to authenticated users)
router.post('/:jobId/apply', authenticateToken, async (req, res) => {
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

// Update application status (restricted to authenticated employers)
router.patch('/:jobId/applications/:appId', authenticateToken, verifyRole('employer'), async (req, res) => {
  const { jobId, appId } = req.params;
  const { status } = req.body; // Status can be "accepted" or "rejected"

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

// Export the router
module.exports = router;