import React, { useState } from 'react';
import axios from 'axios';
import './PostJob.css'; // Import your CSS for styling

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [skills, setSkills] = useState([]); // Initialize skills array

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

  return (
    <div>
      <h2>Post a Job</h2>
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
        <div className="skills-container">
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

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;