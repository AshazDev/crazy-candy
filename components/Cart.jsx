import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, showCart } = useStateContext();
  const router = useRouter();

  const handleCheckout = () => {
    setShowCart(false);
    router.push({
      pathname: '/Checkout',
      query: {
        totalPrice,
        cartItems: JSON.stringify(cartItems),
      },
    });
  };

  const handleQuantityChange = (item, action) => {
    if (action === 'dec' && item.quantity <= 1) {
      onRemove(item);
      toast.success(`${item.name} removed from cart.`, { icon: '✅' });
    } else if (action === 'inc' && item.quantity >= item.stock) {
      toast.error(`Cannot add more than ${item.stock} units of ${item.name}.`, { icon: '❌' });
    } else {
      toggleCartItemQuantity(item._id, action);
    }
  };

  const handleRemoveItem = (item) => {
    onRemove(item);
    toast.success(`${item.name} removed from cart.`, { icon: '✅' });
  };

  return (
    <div className={`cart-wrapper ${showCart ? 'show' : ''}`}>
      <div className="cart-container">
        <button type="button" className="cart-heading" onClick={() => setShowCart(false)}>
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
                <button type="button" onClick={() => setShowCart(false)} className="btn">
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
                          <span className="minus" onClick={() => handleQuantityChange(item, 'dec')}>
                            <AiOutlineMinus />
                          </span>
                          <span className="num">{item.quantity}</span>
                          <span className="plus" onClick={() => handleQuantityChange(item, 'inc')}>
                            <AiOutlinePlus />
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="remove-item"
                        onClick={() => handleRemoveItem(item)}
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
