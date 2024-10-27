import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployerProfile.css';

const EmployerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch profile data from API on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token);
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
      const response = await axios.patch('/api/employer/profile', profileData, {
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

  return (
    <div className="container">
      <h3>Employer Profile</h3>
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
  );
};

export default EmployerProfile;
