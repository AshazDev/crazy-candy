import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; // Add updateDoc and doc for updating items
import styles from './AdminPage.module.css'; // Import CSS module
import AdminAuth from '../components/AdminAuth'; // Adjust the path as needed

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showFulfilled, setShowFulfilled] = useState(false); // New state for fulfilled orders

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

    setFilteredOrders(results);
  }, [searchQuery, orders, showFulfilled]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFulfilledChange = (e) => {
    setShowFulfilled(e.target.checked); // Update the checkbox state
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
            </div>
          ))}
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminPage;
