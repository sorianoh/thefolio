import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';

const SplashScreen = () => {
  const [dots, setDots] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Mag-redirect sa home page pagkatapos ng 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo">☕</div>
        <h1 className="splash-title">Coffee Center</h1>
        <p className="splash-subtitle">Brewing your experience{dots}</p>
        <div className="splash-spinner"></div>
      </div>
    </div>
  );
};

export default SplashScreen;