import React from 'react';
import Link from 'next/link';
import { urlFor } from '../lib/client';
import styles from './HeroBanner.module.css';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className={styles.heroBannerContainer}>
      <div className={styles.heroBannerText}>
        <p className={styles.smallText}>{heroBanner.smallText}</p>
        <h3 className={styles.midText}>{heroBanner.midText}</h3>
        <h1 className={styles.largeText1}>{heroBanner.largeText1}</h1>
        <Link href={`/product/${heroBanner.product}`}>
          <button type="button" className={styles.heroBannerButton}>
            {heroBanner.buttonText}
          </button>
        </Link>
      </div>
      <img
        src={urlFor(heroBanner.image)}
        alt="Product"
        className={styles.heroBannerImage}
      />
    </div>
  );
};

export default HeroBanner;
