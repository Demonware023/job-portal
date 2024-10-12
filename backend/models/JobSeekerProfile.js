// backend/models/JobSeekerProfile.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSeekerProfileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming the user collection stores job seekers
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  resumeUrl: {
    type: String, // Could be a link to a resume file
    required: true,
  },
});

// Export the JobSeekerProfile model
module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);