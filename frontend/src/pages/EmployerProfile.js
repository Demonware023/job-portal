import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployerProfile.css'; // Import the CSS file

const EmployerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Add state for message

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from storage
        const response = await axios.get('/api/employer/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });

        if (response.data.profile) {
          const { companyName, description, location, websiteUrl, industry, profileImage } = response.data.profile;
          setCompanyName(companyName || '');
          setDescription(description || '');
          setLocation(location || '');
          setWebsiteUrl(websiteUrl || '');
          setIndustry(industry || '');
          setProfileImage(profileImage || null);
        } else {
          console.error('Profile data not found');
        }
      } catch (err) {
        console.error('Error fetching profile data.', err);
        setError('Error fetching your profile data, please contact support for further assistance.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve token from storage
      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('websiteUrl', websiteUrl);
      formData.append('industry', industry);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.patch('/api/employer/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      if (response.status === 200) {
        setMessage(response.data.msg || 'Profile updated successfully'); // Set the success message
      } else {
        setError('Failed to update profile. Try again.'); // Set error message if not 200
      }
    } catch (error) {
      setError('Failed to update profile. Try again.'); // Set error message
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <h2>Employer Profile</h2>
      <div>
        {profileImage && (
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Profile"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }} // You can keep this inline for the image
          />
        )}
        <h3>{companyName}</h3>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Website:</strong> {websiteUrl}</p>
        <p><strong>Industry:</strong> {industry}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Company Description"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <input
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="Website URL (optional)"
        />
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Industry (optional)"
        />
        <input
          type="file"
          onChange={handleImageChange}
        />
        <button type="submit">Update Profile</button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>} {/* Display message */}
    </div>
  );
};

export default EmployerProfile;
