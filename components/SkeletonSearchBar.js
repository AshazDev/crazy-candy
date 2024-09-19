import React from 'react';
import styles from './SkeletonSearchBar.module.css'; // Import styles

const SkeletonSearchBar = () => {
  return (
    <div className={styles.skeletonSearchBar}>
      <div className={styles.skeletonInput}></div>
    </div>
  );
};

export default SkeletonSearchBar;
