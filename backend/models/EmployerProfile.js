// backend/models/EmployerProfile.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employerProfileSchema = new Schema({
  employerId: {  // Changed from userId to employerId for clarity
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer', // Referencing the Employer model
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: false, // Optional field
  },
  industry: {
    type: String,
    required: false, // Optional field
  },
  profileImage: { // New field to store the profile image filename or path
    type: String,
    required: false, // Optional field; you may change this to true if you want to enforce it
  },
});

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);