import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import './EmployerProfile.css'; // Make sure to import your CSS

const EmployerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = { companyName, description, location, websiteUrl, industry };

    console.log('Profile data to be submitted:', profileData); // Log the profile data before submission

    try {
      const token = localStorage.getItem('token'); // Retrieve token

      // Make API call to save the profile data
      const response = await axios.patch('/api/employer/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      });

      console.log('Response from API:', response.data); // Log response

      // Save profile data to local storage
      localStorage.setItem('employerProfile', JSON.stringify(response.data));

      // Update local state with the response data
      const { companyName, description, location, websiteUrl, industry } = response.data;
      console.log('Updated profile data:', { companyName, description, location, websiteUrl, industry });

      setCompanyName(companyName);
      setDescription(description);
      setLocation(location);
      setWebsiteUrl(websiteUrl);
      setIndustry(industry);

      // Close modal after saving
      setIsModalOpen(false);
      setErrorMessage(''); // Clear error message
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.'); // Set error message
    }
  };

  return (
    <div className="container">
      <h3>Employer Profile</h3>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
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