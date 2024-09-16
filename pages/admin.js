import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import AdminAuth from '../components/AdminAuth'; // Adjust the path as needed
import styles from './AdminPage.module.css'; // Import CSS module

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fulfilledFilter, setFulfilledFilter] = useState('all'); // Dropdown for filtering
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState('all');
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [orderDates, setOrderDates] = useState([]);
  const [pendingPickupOrders, setPendingPickupOrders] = useState(0);
  const [pendingDeliveryOrders, setPendingDeliveryOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const orderSnapshot = await getDocs(ordersCollection);
      const ordersList = orderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setFilteredOrders(ordersList);

      // Analytics
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      const todayOrders = ordersList.filter(order => {
        const orderDate = order.createdAt ? new Date(order.createdAt.seconds * 1000) : null;
        return orderDate && orderDate >= startOfDay;
      });

      setTotalOrdersToday(todayOrders.length);
      setTotalRevenue(ordersList.reduce((acc, order) => acc + (order.total || 0), 0));

      // Prepare data for the graph: Orders per day
      const ordersGroupedByDate = ordersList.reduce((acc, order) => {
        const orderDate = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown';
        if (!acc[orderDate]) {
          acc[orderDate] = 0;
        }
        acc[orderDate] += 1;
        return acc;
      }, {});

      const dates = Object.keys(ordersGroupedByDate);
      const orderCounts = Object.values(ordersGroupedByDate);

      setOrderDates(dates);
      setOrderData(orderCounts);

      // Calculate pending orders
      setPendingPickupOrders(ordersList.filter(order => order.deliveryMethod === 'pickup' && !order.isFulfilled).length);
      setPendingDeliveryOrders(ordersList.filter(order => order.deliveryMethod === 'delivery' && !order.isFulfilled).length);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let results = orders.filter(order =>
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (fulfilledFilter !== 'all') {
      results = fulfilledFilter === 'fulfilled'
        ? results.filter(order => order.isFulfilled)
        : results.filter(order => !order.isFulfilled);
    }

    if (deliveryMethodFilter !== 'all') {
      results = results.filter(order => order.deliveryMethod === deliveryMethodFilter);
    }

    setFilteredOrders(results);
  }, [searchQuery, orders, fulfilledFilter, deliveryMethodFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFulfilledChange = (e) => {
    setFulfilledFilter(e.target.value);
  };

  const handleDeliveryMethodChange = (e) => {
    setDeliveryMethodFilter(e.target.value);
  };

  const handleItemFulfilledChange = async (orderId, itemIndex) => {
    const updatedOrders = [...orders];
    const order = updatedOrders.find(order => order.id === orderId);

    if (order) {
      const item = order.items[itemIndex];
      item.fulfilled = !item.fulfilled;

      setOrders(updatedOrders);

      const allItemsFulfilled = order.items.every(item => item.fulfilled);
      order.isFulfilled = allItemsFulfilled;

      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        items: order.items,
        isFulfilled: allItemsFulfilled,
      });
    }
  };

  const handleSendEmail = async (order, emailType) => {
    const apiUrl = emailType === 'pickup' ? '/api/sendPickupEmail' : '/api/sendDeliveryEmail';
    const subject = emailType === 'pickup'
      ? 'Your Order is Ready for Pickup'
      : 'Your Order is Out for Delivery';

    const message = `Dear ${order.name},\n\nYour order with ID ${order.id} is ${emailType === 'pickup' ? 'ready for pickup, please pickup your order from here: https://maps.app.goo.gl/NWWbGbfD6tsr51gT6' : 'out for delivery'}.`;

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
        const errorText = await response.text();
        throw new Error(`Network response was not ok. ${errorText}`);
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const lineChartData = {
    labels: orderDates,
    datasets: [
      {
        label: 'Number of Orders',
        data: orderData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Orders Per Day',
      },
    },
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
          <label className={styles.label}>
            <span>Show Orders: </span>
            <select value={fulfilledFilter} onChange={handleFulfilledChange} className={styles.select}>
              <option value="all">All</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="unfulfilled">Unfulfilled</option>
            </select>
          </label>

          <label className={styles.label}>
            <span>Delivery Method: </span>
            <select value={deliveryMethodFilter} onChange={handleDeliveryMethodChange} className={styles.select}>
              <option value="all">All</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>
        </div>

        <div className={styles.analyticsSection}>
          <h2>Analytics</h2>
          <div className={styles.analyticsCards}>
            <div className={styles.analyticsCard}>
              <h3>Orders Today</h3>
              <p>{totalOrdersToday}</p>
            </div>

            <div className={styles.analyticsCard}>
              <h3>Total Revenue</h3>
              <p>BD {totalRevenue.toFixed(2)}</p>
            </div>

            <div className={styles.analyticsCard}>
              <h3>Pending Pickup Orders</h3>
              <p>{pendingPickupOrders}</p>
            </div>

            <div className={styles.analyticsCard}>
              <h3>Pending Delivery Orders</h3>
              <p>{pendingDeliveryOrders}</p>
            </div>
          </div>

          <div className={styles.graphContainer}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className={styles.ordersList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <h3>Order ID: {order.id}</h3>
                <p>Name: {order.name}</p>
                <p>Email: {order.email}</p>
                <p>Total: BD {order.total.toFixed(2)}</p>
                <p>Fulfilled: {order.isFulfilled ? 'Yes' : 'No'}</p>
                <p>Delivery Method: {order.deliveryMethod}</p>

                <button
                  className={styles.sendEmailButton}
                  onClick={() => handleSendEmail(order, order.deliveryMethod)}
                >
                  {order.deliveryMethod === 'pickup' ? 'Send Pickup Email' : 'Send Delivery Email'}
                </button>

                {order.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={item.fulfilled}
                            onChange={() => handleItemFulfilledChange(order.id, index)}
                        />
                        Fulfilled
                        </label>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminPage;
