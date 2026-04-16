import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

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