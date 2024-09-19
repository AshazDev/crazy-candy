// components/ProductPageSkeletonLoader.js
import React from 'react';
import styles from './ProductPageSkeletonLoader.module.css'; // Add styles for skeleton loader

const ProductPageSkeletonLoader = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonLeft}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.skeletonThumbnail}></div>
        <div className={styles.skeletonThumbnail}></div>
        <div className={styles.skeletonThumbnail}></div>
      </div>
      <div className={styles.skeletonRight}>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonPrice}></div>
        <div className={styles.skeletonStock}></div>
        <div className={styles.skeletonQuantity}></div>
        <div className={styles.skeletonButton}></div>
        <div className={styles.skeletonButton}></div>
      </div>
    </div>
  );
};

export default ProductPageSkeletonLoader;
