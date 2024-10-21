// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import './App.css';
import Login from './pages/Login';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import RegisterJobSeeker from './pages/RegisterJobSeeker';
import RegisterEmployer from './pages/RegisterEmployer';
import LandingPage from './components/LandingPage';
import theme from './theme';
import JobSeekerProfile from './pages/JobSeekerProfile';
import EmployerProfile from './pages/EmployerProfile';
import EmployersJobsPage from './pages/EmployersJobsPage';
import JobSeekerJobsPage from './pages/JobSeekerJobsPage';
import JobSeekerApplication from './pages/JobSeekerApplication';
import EmployerApplications from './pages/EmployerApplications';
import EmployerSettings from './pages/EmployerSettings';
import JobSeekerSettings from './pages/JobSeekerSettings';
import RecommendedJobs from './pages/RecommendedJobs';
import JobApplication from './pages/JobApplication';
import NotFound from './pages/NotFound';

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
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
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
            <Route path="/login" element={<Login />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/register-employer" element={<RegisterEmployer />} />
            <Route path="/register-jobseeker" element={<RegisterJobSeeker />} />
            <Route path="/jobseeker/dashboard" element={<ProtectedRoute><JobSeekerDashboard /></ProtectedRoute>} />
            <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
            <Route path="/jobseeker/profile" element={<ProtectedRoute><JobSeekerProfile /></ProtectedRoute>} />
            <Route path="/employer/profile" element={<ProtectedRoute><EmployerProfile /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
            <Route path="/jobseeker/jobs" element={<ProtectedRoute><JobSeekerJobsPage /></ProtectedRoute>} />
            <Route path="/employer/jobs" element={<ProtectedRoute><EmployersJobsPage /></ProtectedRoute>} />
            <Route path="/jobseeker/application" element={<ProtectedRoute><JobSeekerApplication /></ProtectedRoute>} />
            
            {/* General route for Employer Applications */}
            <Route path="/employer/applications" element={<ProtectedRoute><EmployerApplications /></ProtectedRoute>} />
            {/* Dynamic route for specific job applications */}
            <Route path="/employer/applications/:jobId" element={<ProtectedRoute><EmployerApplications /></ProtectedRoute>} />
            
            <Route path="/employer/settings" element={<ProtectedRoute><EmployerSettings /></ProtectedRoute>} />
            <Route path="/jobseeker/settings" element={<ProtectedRoute><JobSeekerSettings /></ProtectedRoute>} />
            <Route path="/jobseeker/recommended-jobs" element={<ProtectedRoute><RecommendedJobs /></ProtectedRoute>} />
            <Route path="/job-application/:jobId" element={<ProtectedRoute><JobApplication /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
