// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostJob from './components/PostJob'; // Import the PostJob component
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching data!', error);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Render header only on the landing page */}
          <Route path="/" element={
            <>
              <header className="App-header">
                <h1>Alx -- Job -- Portals</h1>
                <p>{message}</p>
              </header>
              <Home message={message} />
            </>
          } />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
