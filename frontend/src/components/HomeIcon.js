// src/components/HomeIcon.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeIcon.css';

const HomeIcon = () => {
  const [dashboardLink, setDashboardLink] = useState('/');

  useEffect(() => {
    // Get the user role from local storage
    const role = localStorage.getItem('role');
    // Determine the correct dashboard link based on user role
    if (role === 'employer') {
      setDashboardLink('/employer/dashboard');
    } else if (role === 'jobSeeker') {
      setDashboardLink('/jobseeker/dashboard');
    }
  }, []);

  return (
    <Link to={dashboardLink} className="home-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="icon"
        width="24px"
        height="24px"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5v-5.25a1.5 1.5 0 00-3 0V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z"
        />
      </svg>
    </Link>
  );
};

export default HomeIcon;
