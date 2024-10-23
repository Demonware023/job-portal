import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';  // Header-specific styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Alx Job Portal</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/jobs">Find Jobs</Link></li>
          <li><Link to="/post-job">Post a Job</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
