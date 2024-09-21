import React, { useEffect, useState } from 'react';
import { StateProvider } from '../context/StateContext';
import SplashScreen from '../components/SplashScreen';
import Navbar from '../components/Navbar'; // Ensure correct import
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StateProvider>
      {showSplash && <SplashScreen />}
      {!showSplash && (
        <>
          <Navbar /> {/* Navbar for both mobile and desktop */}
          <Component {...pageProps} />
        </>
      )}
    </StateProvider>
  );
}

export default MyApp;
