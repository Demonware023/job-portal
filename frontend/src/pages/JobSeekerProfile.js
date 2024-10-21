import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobSeekerProfile = () => {
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    // Fetch existing profile data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assume token is stored in localStorage
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
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage
      const response = await axios.post('/api/jobseeker/profile', {
        bio,
        skills: skills.split(',').map((skill) => skill.trim()), // Split by comma
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
    <div>
      <h2>Job Seeker Profile</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <textarea
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <input
          type="url"
          placeholder="Resume URL"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default JobSeekerProfile;