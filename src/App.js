import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed useLocation since it's not being used
import SplashScreen from './components/SplashScreen';
import Home from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Check if splash screen has been shown before
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    } else {
      // Show splash for 3 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;