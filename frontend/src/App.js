// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob'; // Import the PostJob component
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import RegisterJobSeeker from './pages/RegisterJobSeeker';
import RegisterEmployer from './pages/RegisterEmployer';


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
                <p>Welcome to Alx Job Portal</p>
                <p>Find your next job or hire top talent.</p>
                <p>{message}</p>
              </header>
              <Home message={message} />
            </>
          } />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-employer" element={<RegisterEmployer />} />
          <Route path="/register-jobseeker" element={<RegisterJobSeeker />} />
          <Route path="/jobseeker/dashboard" element={<ProtectedRoute><JobSeekerDashboard /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
