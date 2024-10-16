const express = require('express');
const { check, validationResult } = require('express-validator'); // Import express-validator
// const { registerEmployer, getEmployerProfile } = require('../controllers/employerController');
const { authenticateEmployer, authenticateToken } = require('../middleware/auth'); // Adjust import path if needed
const Employer = require('../models/Employer'); // Adjust import path if needed
const Job = require('../models/Job'); // Ensure the path to your Job model is correct
const JobApplication = require('../models/JobApplication');
const router = express.Router();

// Middleware to verify user role
/* const verifyRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient role' });
  }
  next();
}; */

// POST route for registering an employer
// router.post('/', registerEmployer);

// GET route for retrieving an employer profile by ID
// router.get('/:id', getEmployerProfile);

// PATCH /api/employer/profile
router.patch('/profile', authenticateToken, authenticateEmployer, async (req, res) => {
  const { companyName, description } = req.body;
  try {
    const employer = await Employer.findByIdAndUpdate(req.employer.id, { companyName, description }, { new: true });
    if (!employer) return res.status(404).json({ msg: 'Employer not found' });
    res.status(200).json(employer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/employer/jobs - Job posting (restricted to authenticated employers)
router.post(
  '/jobs',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('pay', 'Pay must be a valid number').isFloat(),
  ],
  authenticateToken,
  authenticateEmployer,
  async (req, res) => {
    console.log('Incoming job post request'); // Log at the start of the request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, pay } = req.body;
    console.log('Request body:', req.body);
    console.log('Job details:', { title, description, location, pay }); // Log the incoming job data

    try {
      const newJob = new Job({
        title,
        description,
        location,
        pay,
        employerId: req.employer.id, // Employer who created the job
        applications: [],
      });

      await newJob.save();
      console.log('Job saved successfully:', newJob); // Log the job after saving

      res.status(201).json({ msg: 'Job posted successfully', job: newJob });
    } catch (err) {
      console.error('Error creating job:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// GET /api/employer/jobs - Fetch jobs posted by the employer (restricted to authenticated employers)
router.get('/jobs', authenticateToken, authenticateEmployer, async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.employer.id });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/employer/jobs/:id - Update a job posting (restricted to authenticated employers)
router.put('/jobs/:id', authenticateToken, authenticateEmployer, async (req, res) => {
  try {
    const { title, description, location, pay } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    job.title = title || job.title;
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

// DELETE /api/employer/jobs/:id - Delete a job posting (restricted to authenticated employers)
router.delete('/jobs/:id', authenticateToken, authenticateEmployer, async (req, res) => {
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

// PATCH /api/jobs/:jobId/applications/:appId - Update application status (restricted to authenticated employers)
router.patch('/jobs/:jobId/applications/:appId', authenticateToken, authenticateEmployer, async (req, res) => {
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

// GET /api/employer/applications - Fetch job applications for jobs posted by the employer
router.get('/applications', authenticateToken, authenticateEmployer, async (req, res) => {
  try {
    const employerId = req.employer.id; // Assuming employer is authenticated

    // Find jobs posted by the employer
    const jobs = await Job.find({ employerId });

    // Extract job IDs
    const jobIds = jobs.map(job => job._id);

    // Find applications for those jobs
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate('jobSeekerId', 'name email') // Populate job seeker details
      .populate('jobId', 'title'); // Populate job title

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send('Server error');
  }
});

// Export the router
module.exports = router;