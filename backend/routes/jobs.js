const express = require('express');
const { authenticateToken } = require('../routes/auth');
const Job = require('../models/Job');
const router = express.Router();

// Middleware to verify user role
const verifyRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient role' });
  }
  next();
};

// Create a new job posting (restricted to authenticated users and specific roles)
router.post('/', authenticateToken, verifyRole('employer'), async (req, res) => {
  const { title, company, description, location } = req.body;
  try {
    const job = new Job({ title, company, description, location });
    await job.save();
    res.status(201).json({ job });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all job postings (GET)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from the database
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).send('Server error');
  }
});

// Update a job posting (PUT)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, company, description, location } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.description = description || job.description;
    job.location = location || job.location;

    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).send('Server error');
  }
});

// Delete a job posting (DELETE)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    await job.remove();
    res.json({ msg: 'Job removed' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;