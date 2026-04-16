import React from 'react';
import { NavLink } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import coffeeLogo from '../assets/images/coffee-logo.jpeg';

const Header = () => {
  return (
    <header className="header">
      <DarkModeToggle />
      <div className="logo-section">
        <img src={coffeeLogo} alt="Coffee Center Logo" className="logo-circle" />
        <span className="site-title">COFFEE FIRST</span>
      </div>
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>ABOUT</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>CONTACT</NavLink></li>
          <li><NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>REGISTER</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;