import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import styles from './AdminPage.module.css'; // Import CSS module
import AdminAuth from '../components/AdminAuth'; // Adjust the path as needed

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showFulfilled, setShowFulfilled] = useState(false); // New state for fulfilled orders
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState('all'); // State for filtering by delivery method

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const orderSnapshot = await getDocs(ordersCollection);
      const ordersList = orderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setFilteredOrders(ordersList); // Initialize filteredOrders
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let results = orders.filter(order =>
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by fulfilled status
    if (showFulfilled) {
      results = results.filter(order => order.isFulfilled);
    } else {
      results = results.filter(order => !order.isFulfilled);
    }

    // Filter by delivery method (pickup, delivery, or all)
    if (deliveryMethodFilter !== 'all') {
      results = results.filter(order => order.deliveryMethod === deliveryMethodFilter);
    }

    setFilteredOrders(results);
  }, [searchQuery, orders, showFulfilled, deliveryMethodFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFulfilledChange = (e) => {
    setShowFulfilled(e.target.checked); // Update the checkbox state
  };

  const handleDeliveryMethodChange = (e) => {
    setDeliveryMethodFilter(e.target.value); // Update the delivery method filter
  };

  // Function to toggle the fulfilled status of an item
  const handleItemFulfilledChange = async (orderId, itemIndex) => {
    const updatedOrders = [...orders];
    const order = updatedOrders.find(order => order.id === orderId);

    if (order) {
      const item = order.items[itemIndex];
      item.fulfilled = !item.fulfilled; // Toggle the fulfilled status of the item

      // Update the state
      setOrders(updatedOrders);

      // Check if all items are fulfilled to mark the order as fulfilled
      const allItemsFulfilled = order.items.every(item => item.fulfilled);
      order.isFulfilled = allItemsFulfilled;

      // Update the fulfillment status of the order and items in Firestore
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        items: order.items, // Update the items array
        isFulfilled: allItemsFulfilled // Update the order's fulfilled status
      });
    }
  };

  const handleSendEmail = async (order, emailType) => {
    const apiUrl = emailType === 'pickup' ? '/api/sendPickupEmail' : '/api/sendDeliveryEmail';
    const subject = emailType === 'pickup'
      ? 'Your Order is Ready for Pickup'
      : 'Your Order is Out for Delivery';

    const message = `Dear ${order.name},\n\nYour order with ID ${order.id} is ${emailType === 'pickup' ? 'ready for pickup' : 'out for delivery'}.`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: order.email,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read error message
        throw new Error(`Network response was not ok. ${errorText}`);
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <AdminAuth>
      <div className={styles.adminPage}>
        <h1 className={styles.title}>Admin Orders</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by name, email, or order ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterOptions}>
          <label>
            <input
              type="checkbox"
              checked={showFulfilled}
              onChange={handleFulfilledChange}
            />
            Show Fulfilled Orders
          </label>
          <label>
            <select value={deliveryMethodFilter} onChange={handleDeliveryMethodChange}>
              <option value="all">All</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>
        </div>

        <div className={styles.ordersList}>
          {filteredOrders.length === 0 && <p>No orders found.</p>}
          {filteredOrders.map((order) => (
            <div className={styles.order} key={order.id}>
              <h3 className={styles.orderId}>Order ID: {order.id}</h3>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Delivery Method:</strong> {order.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</p>

              {order.paymentMethod === 'benefit' && order.imageUrl && (
                <div className={styles.orderImage}>
                  <h4>Benefit Pay Image:</h4>
                  <img
                    src={order.imageUrl}
                    alt="Benefit Pay Receipt"
                    className={styles.image}
                  />
                </div>
              )}

              {order.paymentMethod === 'cash' && (
                <p>
                  <strong>Total:</strong>
                  {order.total ? ` BD${order.total.toFixed(2)}` : ' N/A'}
                </p>
              )}

              <div>
                <strong>Items:</strong>
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  <ul className={styles.cartItems}>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} (Quantity: {item.quantity}){' '}
                        <input
                          type="checkbox"
                          checked={item.fulfilled || false}
                          onChange={() => handleItemFulfilledChange(order.id, index)}
                        />{' '}
                        {item.fulfilled ? 'Fulfilled' : 'Pending'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in the cart.</p>
                )}
              </div>

              <p>
                <strong>Status:</strong> {order.isFulfilled ? 'Fulfilled' : 'Pending'}
              </p>

              <div className={styles.orderButtons}> {/* Add this wrapper for buttons */}
                <div className={styles.buttonContainer}>
                  {order.deliveryMethod === 'pickup' && !order.isFulfilled && (
                    <button
                      onClick={() => handleSendEmail(order, 'pickup')}
                      className={styles.button} // Apply button class
                    >
                      Send Pickup Email
                    </button>
                  )}
                  {order.deliveryMethod === 'delivery' && !order.isFulfilled && (
                    <button
                      onClick={() => handleSendEmail(order, 'delivery')}
                      className={styles.button} // Apply button class
                    >
                      Send Delivery Email
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminPage;
