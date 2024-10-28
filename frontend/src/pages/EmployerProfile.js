import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './EmployerProfile.css';
import HomeIcon from '../components/HomeIcon';

const EmployerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch profile data from API on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/employer/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { companyName, description, location, websiteUrl, industry } = response.data;

        // Set state for all profile fields
        setCompanyName(companyName || '');
        setDescription(description || '');
        setLocation(location || '');
        setWebsiteUrl(websiteUrl || '');
        setIndustry(industry || '');

        // Save profile to local storage
        localStorage.setItem('employerProfile', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Failed to fetch profile. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  // Handle form submission to save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = { companyName, description, location, websiteUrl, industry };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/employer/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure all fields are saved in local storage and state
      localStorage.setItem('employerProfile', JSON.stringify(response.data));
      const { companyName, description, location, websiteUrl, industry } = response.data;

      // Set state for all profile fields with updated data
      setCompanyName(companyName);
      setDescription(description);
      setLocation(location);
      setWebsiteUrl(websiteUrl);
      setIndustry(industry);

      // Close modal after saving
      setIsModalOpen(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
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
          <h2>Employer Profile</h2>
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="profile-details">
          <p><strong>Company Name:</strong> {companyName}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Website:</strong> {websiteUrl}</p>
          <p><strong>Industry:</strong> {industry}</p>
          <button className="edit-button" onClick={() => setIsModalOpen(true)}>Edit Profile</button>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
              <h3>Edit Employer Profile</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Company Name:</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Location:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Website:</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label>Industry:</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <button type="submit">Save Profile</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;
