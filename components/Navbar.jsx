import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineHome, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/router'; // Import Next.js router for navigation

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchClick = () => {
    router.push('/search'); // Redirect to the search page
  };

  return (
    <>
      {/* Desktop Navbar (hidden on mobile) */}
      <div className={`navbar-container desktop-navbar ${isMobile ? 'hidden' : ''}`}>
        <p className="logo">
          <Link href="/">Crazy Candy</Link>
        </p>

        <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
          <AiOutlineShoppingCart />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>

        {showCart && <Cart />}
      </div>

      {/* Mobile Navbar (only visible on mobile) */}
      {isMobile && (
        <nav className="mobile-navbar">
          <div className="mobile-navbar-container">
            <Link href="/" passHref>
              <AiOutlineHome className="icon" />
            </Link>
            <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
              <AiOutlineShoppingCart />
              <span className="cart-item-qty">{totalQuantities}</span>
            </button>
          </div>

          {showCart && <Cart />}
        </nav>
      )}
    </>
  );
};

export default Navbar;
