const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employer'], default: 'employer' } // Added role field
});

// Password hashing before saving the employer
EmployerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords for login
EmployerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Employer = mongoose.model('Employer', EmployerSchema);

module.exports = Employer;