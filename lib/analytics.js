import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const AdminAnalyticsPage = () => {
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [orderDates, setOrderDates] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const ordersCollection = collection(db, 'orders');
      const q = query(ordersCollection, where('date', '>=', startOfMonth));

      const ordersSnapshot = await getDocs(q);
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

      const monthlyOrders = orders.filter(order => {
        const orderDate = new Date(order.date.seconds * 1000);
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      });

      setTotalOrdersThisMonth(monthlyOrders.length);
      setTotalRevenue(totalRevenue);
      setOrderData(monthlyOrders.map(order => order.amount));
      setOrderDates(monthlyOrders.map(order => new Date(order.date.seconds * 1000).toLocaleDateString()));
    };

    fetchAnalyticsData();
  }, []);

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
        text: 'Trend of Orders This Month',
      },
    },
  };

  return (
    <div className="analytics-page-container">
      <h1>Analytics Dashboard</h1>

      <div className="buttons-container">
        <div className="buttons-horizontal">
          <Link href="/admin">
            <button className="switch-button">Admin</button>
          </Link>
          <Link href="/analytics">
            <button className="switch-button">Analytics</button>
          </Link>
          <Link href="https://crazy-candy.sanity.studio/">
            <button className="switch-button">Sanity</button>
          </Link>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>Orders This Month</h3>
          <p>{totalOrdersThisMonth}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Add the trend graph here */}
      <div className="graph-container">
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
