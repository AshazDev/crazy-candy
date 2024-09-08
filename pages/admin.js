import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './AdminPage.module.css'; // Import CSS module
import AdminAuth from '../components/AdminAuth'; // Adjust the path as needed

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

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
    const results = orders.filter(order =>
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchQuery, orders]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
                        {item.name} (Quantity: {item.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in the cart.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminPage;
