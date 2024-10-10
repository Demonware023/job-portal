// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the welcome message from the backend
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/home'); // Assume your backend has this route
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching home message:', error);
        setMessage('Failed to load message');
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to the Job Board</h1>
      <p>{message}</p>
      <div className="home-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;