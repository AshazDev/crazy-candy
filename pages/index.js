import React, { useState } from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component

const Home = ({ products, bannerData }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on searchTerm
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

      <div className="products-heading">
        <h2>Products</h2>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <Product key={product._id} product={product} />)
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]} />
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
  }
}

export default Home;
