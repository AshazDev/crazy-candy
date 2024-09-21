import React, { useState, useEffect } from 'react';
import styles from './SplashScreen.module.css';
import logo from './logo.png'; // Import the logo image

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.splashScreen}>
      <img src={logo.src} alt="Crazy Candy Logo" className={styles.splashLogo} />
    </div>
  );
};

export default SplashScreen;
