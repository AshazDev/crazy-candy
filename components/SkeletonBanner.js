import React from 'react';
import styles from './SkeletonBanner.module.css'; // Import styles

const SkeletonBanner = () => {
  return (
    <div className={styles.skeletonBanner}>
      <div className={styles.skeletonBannerImage}></div>
      <div className={styles.skeletonBannerText}></div>
    </div>
  );
};

export default SkeletonBanner;
