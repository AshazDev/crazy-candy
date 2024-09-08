import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const Product = ({ product: { stock, name, slug, price, image } }) => {
  return (
    <div className="product-card">
      {stock >= 1 ? (
        <Link href={`/product/${slug.current}`}>
          <img
            src={urlFor(image && image[0])}
            alt={name}
            width={250}
            height={250}
            className="product-image"
          />
        </Link>
      ) : (
        <img
          src={urlFor(image && image[0])}
          alt={name}
          width={250}
          height={250}
          className="product-image"
          style={{ opacity: 0.5, pointerEvents: 'none' }} // Add opacity and pointer-events styles
        />
      )}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">BD{price}</p>
        <p className="product-stock">{stock < 1 ? 'Out of Stock' : 'In Stock'}</p>
      </div>
    </div>
  );
};

export default Product;
