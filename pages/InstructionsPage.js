import React from 'react';
import styles from './InstructionsPage.module.css';

const InstructionsPage = () => {
  return (
    <div className={styles.instructionsContainer}>
      <h1>Add Crazy Candy to Your Home Screen</h1>
      <div className={styles.step}>
        <h2>For Android</h2>
        <p>1. Open the Chrome browser.</p>
        <p>2. Go to the Crazy Candy website.</p>
        <p>3. Tap the three dots in the upper right corner.</p>
        <p>4. Select "Add to Home screen."</p>
        <p>5. Tap "Add" to confirm.</p>
      </div>
      <div className={styles.step}>
        <h2>For iOS</h2>
        <p>1. Open the Safari browser.</p>
        <p>2. Go to the Crazy Candy website.</p>
        <p>3. Tap the "Share" button at the bottom of the screen.</p>
        <p>4. Select "Add to Home Screen."</p>
        <p>5. Tap "Add" to confirm.</p>
      </div>
      <div className={styles.step}>
        <h2>For Windows</h2>
        <p>1. Open the Edge browser.</p>
        <p>2. Go to the Crazy Candy website.</p>
        <p>3. Click the three dots in the upper right corner.</p>
        <p>4. Select "Install" or "Pin to Taskbar."</p>
      </div>
    </div>
  );
};

export default InstructionsPage;
