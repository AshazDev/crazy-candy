import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const Cart = () => {
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove } = useStateContext();
  const router = useRouter();

  const handleCheckout = () => {
    // Hide the cart when the user clicks Checkout
    setShowCart(false);

    // Proceed to the checkout page
    router.push({
      pathname: '/Checkout',
      query: {
        totalPrice,
        cartItems: JSON.stringify(cartItems), // Send cart items as string
      },
    });
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 ? (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <a>
                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  className="btn"
                >
                  Continue Shopping
                </button>
              </a>
            </Link>
          </div>
        ) : (
          <>
            <div className="product-container">
              {cartItems.map((item) => (
                <div className="product" key={item._id}>
                  <img src={urlFor(item?.image[0])} className="cart-product-image" alt={item.name} />
                  <div className="item-desc">
                    <div className="flex top">
                      <h5>{item.name}</h5>
                      <h4>BD{item.price}</h4>
                    </div>
                    <div className="flex bottom">
                      <div>
                        <p className="quantity-desc">
                          <span className="minus" onClick={() => toggleCartItemQuanitity(item._id, 'dec')}>
                            <AiOutlineMinus />
                          </span>
                          <span className="num">{item.quantity}</span>
                          <span className="plus" onClick={() => toggleCartItemQuanitity(item._id, 'inc')}>
                            <AiOutlinePlus />
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="remove-item"
                        onClick={() => onRemove(item)}
                      >
                        <TiDeleteOutline />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-bottom">
              <div className="total">
                <h3>Subtotal:</h3>
                <h3>BD{totalPrice}</h3>
              </div>
              <div className="btn-container">
                <button type="button" className="btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
