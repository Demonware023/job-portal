import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobSeekerSettings.css';

const JobSeekerSettings = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    experience: '',
    resumeUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/jobseeker/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const profileData = response.data.profile;
        setProfile(profileData);
        setFormData({
          bio: profileData.bio || '',
          skills: profileData.skills.join(', ') || '', // assuming skills are stored as an array
          experience: profileData.experience || '',
          resumeUrl: profileData.resumeUrl || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()); // Convert skills to array
      await axios.post('/api/jobseeker/profile', {
        ...formData,
        skills: skillsArray
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="settings-container">
      <h2>Job Seeker Settings</h2>
      {profile ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bio:</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" required />
          </div>
          <div className="form-group">
            <label>Skills (comma-separated):</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Experience:</label>
            <textarea name="experience" value={formData.experience} onChange={handleChange} rows="4" required />
          </div>
          <div className="form-group">
            <label>Resume URL:</label>
            <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} required />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default JobSeekerSettings;