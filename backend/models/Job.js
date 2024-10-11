const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
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
    datePosted: {
        type: Date,
        default: Date.now
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer', // Reference to your employer model
        required: true // Keeping this required to ensure each job has an associated employer
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application', // Reference to application model
    }]
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Export the Job model based on the schema
module.exports = mongoose.model('Job', JobSchema);