// src/components/EmployerSettings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployerSettings.css';

const EmployerSettings = () => {
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [industry, setIndustry] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch existing employer profile
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/employer/profile');
                const profile = response.data;
                setCompanyName(profile.companyName);
                setDescription(profile.description);
                setLocation(profile.location);
                setWebsiteUrl(profile.websiteUrl);
                setIndustry(profile.industry);
            } catch (err) {
                setError('Failed to fetch profile');
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.patch('/api/employer/profile', {
                companyName,
                description,
                location,
                websiteUrl,
                industry,
            });
            
            // Check if the response status is OK
            if (response.status === 200) {
                setMessage('Profile updated successfully');
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    return (
        <div>
            <h2>Employer Settings</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Website URL</label>
                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                </div>
                <div>
                    <label>Industry</label>
                    <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default EmployerSettings;