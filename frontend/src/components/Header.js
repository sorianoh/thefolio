import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import coffeeLogo from '../assets/images/coffee-logo.jpeg';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/messages/unread/count');
      setUnreadCount(data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  // Guest navigation (not logged in)
  const guestLinks = (
    <>
      <li><NavLink to="/home">HOME</NavLink></li>
      <li><NavLink to="/about">ABOUT</NavLink></li>
      <li><NavLink to="/contact">CONTACT</NavLink></li>
      <li><NavLink to="/login">LOGIN</NavLink></li>
      <li><NavLink to="/register">REGISTER</NavLink></li>
    </>
  );

  // Member navigation (may CONTACT link)
  const memberLinks = (
    <>
      <li><NavLink to="/home">HOME</NavLink></li>
      <li><NavLink to="/about">ABOUT</NavLink></li>
      <li><NavLink to="/contact">CONTACT</NavLink></li>
      <li><NavLink to="/create-post">POST</NavLink></li>
      <li><NavLink to="/profile">PROFILE</NavLink></li>
      <li><button onClick={handleLogout} className="logout-btn">LOGOUT</button></li>
    </>
  );

  // Admin navigation
  const adminLinks = (
    <>
      <li><NavLink to="/home">HOME</NavLink></li>
      <li><NavLink to="/about">ABOUT</NavLink></li>
      <li><NavLink to="/contact">CONTACT</NavLink></li>
      <li><NavLink to="/create-post">POST</NavLink></li>
      <li><NavLink to="/profile">PROFILE</NavLink></li>
      <li>
        <NavLink to="/admin">
          ADMIN {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
        </NavLink>
      </li>
      <li><button onClick={handleLogout} className="logout-btn">LOGOUT</button></li>
    </>
  );

  const getNavLinks = () => {
    if (!user) return guestLinks;
    if (user.role === 'admin') return adminLinks;
    return memberLinks;
  };

  return (
    <header className="header">
      <DarkModeToggle />
      <div className="logo-section">
        {/* PERMANENT COFFEE LOGO - hindi napapalitan */}
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

export default Header;