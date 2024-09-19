import React from 'react';
import styles from './SkeletonLoader.module.css'; // Import updated CSS for animation

const SkeletonLoader = () => {
  return (
    <div className={styles.skeletonProductCard}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonText}></div>
    </div>
  );
};

export default SkeletonLoader;
