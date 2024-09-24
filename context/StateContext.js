import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

const customErrorToast = (message) => {
  toast.custom((t) => (
    <div
      style={{
        background: 'white',
        color: 'red',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ color: 'red' }}>⚠️ {message}</span>
      <button onClick={() => toast.dismiss(t.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>✖️</button>
    </div>
  ));
};

const customSuccessToast = (message) => {
  toast.success(message);
};

export const StateProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);

    if (checkProductInCart && checkProductInCart.quantity + quantity > product.stock) {
      customErrorToast(`Only ${product.stock} of ${product.name} in stock!`);
      return;
    }

    if (!checkProductInCart && quantity > product.stock) {
      customErrorToast(`Only ${product.stock} of ${product.name} in stock!`);
      return;
    }

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity,
        };
        return cartProduct;
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    customSuccessToast(`${quantity} ${product.name} added to cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);

    if (foundProduct) {
      const newCartItems = cartItems.filter((item) => item._id !== product._id);

      setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
      setCartItems(newCartItems);

      customErrorToast(`${foundProduct.name} removed from cart.`); // Change to error toast
    } else {
      customErrorToast(`Item not found in cart.`);
    }
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === 'inc') {
      if (foundProduct.quantity < foundProduct.stock) {
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        customSuccessToast(`Increased quantity of ${foundProduct.name}.`);
      } else {
        customErrorToast(`Only ${foundProduct.stock} of ${foundProduct.name} available!`);
      }
    } else if (value === 'dec') {
      if (foundProduct.quantity > 1) {
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        customSuccessToast(`Decreased quantity of ${foundProduct.name}.`);
      } else {
        customErrorToast(`Cannot decrease quantity below 1.`);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Hook to use the context
export const useStateContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
