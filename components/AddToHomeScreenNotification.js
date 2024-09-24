import React, { useEffect, useState } from 'react';
import styles from './AddToHomeScreenNotification.module.css';

const AddToHomeScreenNotification = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          window.location.href = '/InstructionsPage';
        }
        setDeferredPrompt(null);
        setShowBanner(false);
      });
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner}>
      <p>Install Crazy Candy for a better experience!</p>
      <button onClick={handleAddToHomeScreen}>Add to Home Screen</button>
      <button onClick={handleDismiss}>Dismiss</button>
    </div>
  );
};

export default AddToHomeScreenNotification;
