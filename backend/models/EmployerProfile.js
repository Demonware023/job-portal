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
});

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);