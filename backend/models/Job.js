const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pay: {
        type: Number,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer', // Reference to your employer model
        required: true // Ensures each job has an associated employer
    },
    skills: { // Add this field to store job-related skills
        type: [String], // Array of strings for skills
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication', // Reference to JobApplication model
    }]
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Export the Job model based on the schema
module.exports = mongoose.model('Job', JobSchema);