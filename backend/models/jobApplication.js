const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema({
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming job seekers are users in the User collection
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', // Reference to the Job model
        required: true,
    },
    coverLetter: {
        type: String,
        required: true,
    },
    expectedPay: {
        type: Number,
        required: true,
    },
    resume: {
        type: String, // Could be a URL or file path to the resume
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the JobApplication model
module.exports = mongoose.model('JobApplication', jobApplicationSchema);