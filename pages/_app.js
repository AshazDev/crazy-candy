import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { StateProvider } from '../context/StateContext';
import SplashScreen from '../components/SplashScreen';
import Navbar from '../components/Navbar';
import AddToHomeScreenNotification from '../components/AddToHomeScreenNotification'; // Ensure this import is correct
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  return (
    <StateProvider>
      {showSplash && <SplashScreen />}
      {!showSplash && (
        <>
          <Navbar />
          <Component {...pageProps} />
          {/* Only show the notification if the app is not installed */}
          {!isInstalled && <AddToHomeScreenNotification />}
          <Toaster position="top-center" />
        </>
      )}
    </StateProvider>
  );
}

export default MyApp;
