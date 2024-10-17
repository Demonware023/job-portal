// controllers/employerController
const Employer = require('../models/Employer'); // Assuming you have an Employer model

// Register a new employer
const registerEmployer = async (req, res) => {
  const { companyName, email, password } = req.body;

  try {
    // Validate the input fields as necessary
    if (!companyName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create employer
    const newEmployer = new Employer({ companyName, email, password });
    await newEmployer.save();

    return res.status(201).json({ message: 'Employer registered successfully.', data: newEmployer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed, please try again.' });
  }
};

// Get employer profile by ID
const getEmployerProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findById(id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found.' });
    }
    return res.status(200).json({ data: employer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve employer profile.' });
  }
};

module.exports = {
  registerEmployer,
  getEmployerProfile,
};
