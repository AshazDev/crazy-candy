import React from 'react';
import Link from 'next/link';
import { urlFor } from '../lib/client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <div className="hero-banner-text">
        <p className="beats-solo">{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        {/* Ensure image is hidden on mobile */}
        <img src={urlFor(heroBanner.image)} alt="headphones" className="hero-banner-image" />
        <div className="desc">
        </div>
        {/* Button with class for positioning */}
        <Link href={`/product/${heroBanner.product}`}>
          <button type="button" className="hero-banner-button">
            {heroBanner.buttonText}
          </button>
        </Link>
      </div>
    </div>
  )
}

export default HeroBanner;
