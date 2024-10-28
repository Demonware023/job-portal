import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostJob.css'; // Import your CSS for styling
import HomeIcon from '../components/HomeIcon';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [skills, setSkills] = useState([]); // Initialize skills array
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Predefined skill suggestions
  const predefinedSkills = [
    'JavaScript', 'React', 'Node.js', 'CSS', 'MongoDB', 'Python', 'SQL',
    'AWS', 'C', 'Java', 'Ruby', 'GO', 'Servers', 'HTML', 'PHP',
    'Express.js', 'C++', 'Angular', 'Vue', 'C#', 'TypeScript', 'Django',
    'Flask', 'Spring Boot', 'Git', 'GCP', 'Microsoft Azure', 'Docker',
    'Kubernetes', 'CI/CD', 'PostgreSQL', 'Cassandra', 'Redis', 'DSA',
    'RESTful APIs', 'GraphQL', 'WebSockets', 'Unit Tests', 'Integration Tests',
    'Software Design & Architecture', 'SQL injection', 'XSS', 'OAuth', 
    'JWT', 'Problem-Solving', 'Communication', 'Teamwork and Collaboration', 
    'Adaptability and Continuous Learning', 'Attention to Detail', 
    'Time Management', 'Critical Thinking', 'Leadership and Mentoring', 
    'Agile/Scrum methodologies', 'UI/UX Design'
  ];

  const handlePostJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from localStorage

    try {
      const response = await axios.post(
        '/api/employer/jobs',
        { 
          title, // Include title in the job posting
          description, 
          location, 
          pay, 
          skills 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );
      alert(response.data.msg);
      setTitle('');
      setDescription('');
      setLocation('');
      setPay('');
      setSkills([]); // Reset the skills array
    } catch (error) {
      alert('Failed to post the job. Try again.');
    }
  };

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill)); // Remove skill if already added
    } else {
      setSkills([...skills, skill]); // Add skill if not added
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to the login page after logging out
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <div className="logo" />
        <nav>
          <ul>
            <li><HomeIcon /></li>
            <li><Link to="/employer/jobs">My Jobs</Link></li>
            <li><Link to="/employer/applications">Applications</Link></li>
            <li><Link to="/post-job">Post A Job</Link></li>
            <li><Link to="/employer/profile">Profile</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        <div className="header">
          <h2>Post a Job</h2>
          <div className="profile-section">
            <div className="profile-pic" />
            <div className="dropdown">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">▼</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handlePostJob}>
          <label htmlFor="job-title">Job Title</label>
          <input
            id="job-title"
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoComplete="on"
          />
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Pay"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            required
          />

          {/* Skills Section */}
          <label>Selected Skills</label>
          <div className="skills-box">
            {skills.map((skill, index) => (
              <span key={index} className="skill-pill">
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="remove-skill-button"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <label>Or click on a skill to add:</label>
          <div className="predefined-skills-container">
            <div className="predefined-skills-box">
              {predefinedSkills.map((skill, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`predefined-skill-button ${skills.includes(skill) ? 'selected' : ''}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <button type="submit">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
