import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmployerProfile.css'; // Ensure this file contains your CSS from both Dashboard and Profile

const EmployerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Load profile data from local storage when the component mounts
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('employerProfile'));
    if (savedProfile) {
      setCompanyName(savedProfile.companyName);
      setDescription(savedProfile.description);
      setLocation(savedProfile.location);
      setWebsiteUrl(savedProfile.websiteUrl);
      setIndustry(savedProfile.industry);
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = { companyName, description, location, websiteUrl, industry };
    localStorage.setItem('employerProfile', JSON.stringify(profileData));
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/employer/jobs">My Jobs</Link></li>
            <li><Link to="/employer/applications">Applications</Link></li>
            <li><Link to="/post-job">Post A Job</Link></li>
            <li><Link to="/employer/profile">Profile</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <div className="profile-section">
            <img src="path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
            <div className="dropdown">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">▼</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile details */}
        <h3>Employer Profile</h3>
        <div className="profile-details">
          <p><strong>Company Name:</strong> {companyName}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Website:</strong> {websiteUrl}</p>
          <p><strong>Industry:</strong> {industry}</p>
          <button className="edit-button" onClick={() => setIsModalOpen(true)}>Edit Profile</button>
        </div>

        {/* Modal for editing profile */}
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