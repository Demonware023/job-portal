const express = require('express');
const { check, validationResult } = require('express-validator'); // Import express-validator
// const { registerEmployer, getEmployerProfile } = require('../controllers/employerController');
const { authenticateEmployer, authenticateToken } = require('../middleware/auth'); // Adjust import path if needed
// const EmployerProfile = require('../models/EmployerProfile');
const Employer = require('../models/Employer'); // Adjust import path if needed
const Job = require('../models/Job'); // Ensure the path to your Job model is correct
const JobApplication = require('../models/JobApplication');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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


// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save the file in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
});

// PATCH /api/employer/profile - Update employer profile
router.patch(
  '/profile',
  upload.single('profileImage'), // Handle file upload for 'profileImage'
  [
    check('companyName').not().isEmpty().withMessage('Company Name is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('location').not().isEmpty().withMessage('Location is required'),
    check('websiteUrl').optional().isURL().withMessage('Must be a valid URL'),
    check('industry').optional().not().isEmpty().withMessage('Industry should not be empty if provided'),
  ],
  authenticateToken,
  authenticateEmployer,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, description, location, websiteUrl, industry } = req.body;
    const profileImage = req.file ? req.file.filename : null; // Get the uploaded file's name, if present

    try {
      const updateData = { companyName, description, location, websiteUrl, industry };

      // Only add profileImage if it's uploaded
      if (profileImage) {
        updateData.profileImage = profileImage;
      }

      const employer = await Employer.findByIdAndUpdate(
        req.employer.id,
        updateData,
        { new: true, runValidators: true } // Ensure validation is run and return updated document
      );

      if (!employer) return res.status(404).json({ msg: 'Employer not found' });

      res.status(200).json(employer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// GET /api/employer/profile - Get employer profile
router.get('/profile', authenticateToken, authenticateEmployer, async (req, res) => {
  try {
    const employerId = req.employer.id; // Use req.employer.id as per your setup
    const employer = await Employer.findById(employerId); // Fetch employer by ID

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found.' });
    }
    
    res.json({ profile: employer }); // Send the profile data back
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    res.status(500).json({ error: 'Server error fetching profile.' });
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
    check('skills', 'Skills are required').isArray().notEmpty(),
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

    const { title, description, location, pay, skills } = req.body;
    console.log('Request body:', req.body);
    console.log('Job details:', { title, description, location, pay, skills }); // Log the incoming job data

    try {
      const newJob = new Job({
        title,
        description,
        location,
        pay,
        skills,
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

// GET /api/employers/jobs/:jobId/applications - Fetch applications for a specific job
router.get('/jobs/:jobId/applications', authenticateToken, authenticateEmployer, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Fetch job details to get employer information
    const job = await Job.findById(jobId).populate('employerId', 'companyName');

    if (!job) return res.status(404).json({ msg: 'Job not found.' });

    // Fetch applications for the specific job
    const applications = await JobApplication.find({ jobId })
      .populate('jobSeekerId', 'name email') // Populate job seeker details
      .populate({ path: 'jobId', select: 'title' }); // Populate job title

    if (!applications.length) return res.status(404).json({ msg: 'No applications found for this job.' });

/*     // Prepare the response with job and employer details
    const sanitizedApplications = applications.map(app => ({
      id: app._id,
      jobId: app.jobId.title,
      jobSeeker: app.jobSeekerId ? { name: app.jobSeekerId.name, email: app.jobSeekerId.email } : null,
      employer: job.employerId ? { companyName: job.employerId.companyName } : null, // Include employer details
      // Include other fields you might want to add
    })); */

    res.status(200).json(sanitizedApplications);
  } catch (err) {
    console.error('Error fetching applications for job:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/employer/applications - Fetch job applications for jobs posted by the employer
router.get('/applications', authenticateToken, authenticateEmployer, async (req, res) => {
  try {
    const employerId = req.employer.id; // Assuming employer is authenticated

    // Find jobs posted by the employer using employerId
    const jobs = await Job.find({ employerId });

    // Extract job IDs
    const jobIds = jobs.map(job => job._id);

    // Find applications for those jobs
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate('jobSeekerId', 'name email') // Populate job seeker details
      .populate({ path: 'jobId', select: 'title employerId' }); // Populate job title and employerId

    // Map through applications to sanitize data and get employer details
    const sanitizedApplications = await Promise.all(applications.map(async app => {
      const jobDetails = await Job.findById(app.jobId).populate('employerId', 'companyName');
      return {
        id: app._id,
        jobTitle: jobDetails.title,
        jobSeeker: app.jobSeekerId ? { name: app.jobSeekerId.name, email: app.jobSeekerId.email } : null, // Null check
        employer: jobDetails.employerId ? { companyName: jobDetails.employerId.companyName } : null, // Null check for employer
        // Include other fields you might want to add
      };
    }));

    if (!sanitizedApplications.length) return res.status(404).json({ msg: 'No applications found for your jobs.' });

    res.status(200).json(sanitizedApplications);
  } catch (err) {
    console.error('Error fetching applications for employer:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Export the router
module.exports = router;