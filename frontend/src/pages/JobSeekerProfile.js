import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobSeekerProfile.css'; // Import the CSS file for styling

const JobSeekerProfile = () => {
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/jobseeker/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.profile) {
          const { bio, skills, experience, resumeUrl } = response.data.profile;
          setBio(bio);
          setSkills(skills.join(', '));
          setExperience(experience);
          setResumeUrl(resumeUrl);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/jobseeker/profile', {
        bio,
        skills: skills.split(',').map((skill) => skill.trim()), 
        experience,
        resumeUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.msg);
    } catch (error) {
      alert('Failed to update profile. Try again.');
    }
  };

  return (
    <div className="jobseeker-profile-container">
      <h2 className="profile-heading">Job Seeker Profile</h2>
      <div className="profile-details">
        <div className="profile-image">
          <div className="image-placeholder">
            JS {/* Placeholder for profile image */}
          </div>
          <button className="upload-button">Upload or drag your resume photo here</button>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label>Bio:</label>
            <textarea
              className="textarea-input"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Skills:</label>
            <input
              className="text-input"
              type="text"
              placeholder="Skills (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Experience:</label>
            <textarea
              className="textarea-input"
              placeholder="Your experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Resume URL:</label>
            <input
              className="text-input"
              type="url"
              placeholder="Link to your resume"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="save-button">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default JobSeekerProfile;