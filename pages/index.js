import React, { useState, useEffect } from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader'; // Product loader
import SkeletonBanner from '../components/SkeletonBanner'; // Banner loader
import SkeletonSearchBar from '../components/SkeletonSearchBar'; // Search bar loader

const Home = ({ products, bannerData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate data fetching delay
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate a loading delay of 1.5 seconds
  }, []);

  // Filter products based on searchTerm
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <SkeletonBanner /> // Show skeleton banner while loading
      ) : (
        <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      )}

      <div className="products-heading">
        <h2>Products</h2>
      </div>

      {loading ? (
        <SkeletonSearchBar /> // Show skeleton search bar while loading
      ) : (
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
        />
      )}

      <div className="products-container">
        {loading ? (
          // Display product skeleton loaders while data is loading
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <Product key={product._id} product={product} />)
          ) : (
            <p>No products found.</p>
          )
        )}
      </div>

      {loading ? (
        <SkeletonBanner /> // Show skeleton footer banner while loading
      ) : (
        <FooterBanner footerBanner={bannerData && bannerData[0]} />
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  };
};

export default Home;
