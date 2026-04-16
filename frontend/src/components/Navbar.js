// components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import coffeeLogo from '../assets/images/coffee-logo.jpeg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  // Guest navigation (not logged in)
  const guestLinks = (
    <>
      <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink></li>
      <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>ABOUT</NavLink></li>
      <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>CONTACT</NavLink></li>
      <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>LOGIN</NavLink></li>
      <li><NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>REGISTER</NavLink></li>
    </>
  );

  // Member navigation
  const memberLinks = (
    <>
      <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink></li>
      <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>ABOUT</NavLink></li>
      <li><NavLink to="/create-post" className={({ isActive }) => isActive ? 'active' : ''}>WRITE</NavLink></li>
      <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>PROFILE</NavLink></li>
      <li><button onClick={handleLogout} className="logout-btn">LOGOUT</button></li>
    </>
  );

  // Admin navigation (includes Admin panel)
  const adminLinks = (
    <>
      <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink></li>
      <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>ABOUT</NavLink></li>
      <li><NavLink to="/create-post" className={({ isActive }) => isActive ? 'active' : ''}>WRITE</NavLink></li>
      <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>PROFILE</NavLink></li>
      <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>ADMIN</NavLink></li>
      <li><button onClick={handleLogout} className="logout-btn">LOGOUT</button></li>
    </>
  );

  // Determine which navigation to show
  const getNavLinks = () => {
    if (!user) return guestLinks;
    if (user.role === 'admin') return adminLinks;
    return memberLinks;
  };

  return (
    <header className="header">
      <DarkModeToggle />
      <div className="logo-section">
        <img src={coffeeLogo} alt="Coffee Center Logo" className="logo-circle" />
        <span className="site-title">COFFEE FIRST</span>
      </div>
      <nav>
        <ul className="nav-links">
          {getNavLinks()}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;