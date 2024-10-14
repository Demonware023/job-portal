const User = require('../models/User'); // Assuming the User model
const JobSeekerProfile = require('../models/JobSeekerProfile'); // Job Seeker Profile model

// Register a new job seeker
const registerJobSeeker = async (req, res) => {
  const { name, email, password, bio, skills, experience, resumeUrl } = req.body;

  try {
    // Validate the input fields as necessary
    if (!name || !email || !password || !bio || !skills || !experience || !resumeUrl) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create user
    const newUser = new User({ name, email, password, role: 'jobSeeker' });
    await newUser.save();

    // Create job seeker profile
    const newProfile = new JobSeekerProfile({
      userId: newUser._id,
      bio,
      skills,
      experience,
      resumeUrl,
    });
    await newProfile.save();

    return res.status(201).json({ message: 'Job seeker registered successfully.', data: newProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed, please try again.' });
  }
};

// Get job seeker profile by ID
const getJobSeekerProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await JobSeekerProfile.findOne({ userId: id }).populate('userId', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Job seeker profile not found.' });
    }
    return res.status(200).json({ data: profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve job seeker profile.' });
  }
};

module.exports = {
  registerJobSeeker,
  getJobSeekerProfile,
};