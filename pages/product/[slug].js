import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';
import ProductPageSkeletonLoader from '../../components/ProductPageSkeletonLoader'; // Import the skeleton loader

const ProductDetails = ({ product, products }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true); // loading state
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  useEffect(() => {
    if (product) {
      setLoading(false); // Set loading to false once product is available
    }
  }, [product]);

  if (loading) {
    return <ProductPageSkeletonLoader />; // Show skeleton loader when loading
  }

  const { image, name, details, price, stock } = product;

  const handleBuyNow = () => {
    if (qty <= stock) {
      onAdd(product, qty);
      setShowCart(true);
    } else {
      alert('Cannot add more items than available in stock.');
    }
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img src={urlFor(image && image[index])} className="product-detail-image" />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h4>{name}</h4>
          <p>{details}</p>
          <p className="price">BD{price}</p>
          <p className="stock">{stock > 0 ? `In Stock: ${stock}` : 'Out of Stock'}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={() => {
                if (qty < stock) {
                  incQty();
                } else {
                  alert('Cannot add more than available stock.');
                }
              }}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                if (qty <= stock) {
                  onAdd(product, qty);
                } else {
                  alert('Cannot add more items than available in stock.');
                }
              }}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>More Products</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product }
  };
};

export default ProductDetails;
