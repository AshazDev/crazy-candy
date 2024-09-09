import React from 'react';
import { useRouter } from 'next/router';
import styles from './OrderConfirmation.module.css';
import { urlFor } from '../lib/client';

const OrderConfirmation = () => {
  const router = useRouter();
  const {
    orderId,
    name,
    phone,
    email,
    address,
    paymentMethod,
    items,
    total,
  } = router.query;

  return (
    <div className={styles.confirmationPage}>
      <h1 className={styles.title}>Order Confirmation</h1>
      <p className={styles.confirmationText}>Thank you, {name}! Your order has been placed successfully.</p>
      <p className={styles.confirmationText}>You will be emailed when your order is out for delivery or is ready to pick up</p>
      <div className={styles.orderDetails}>
        <p className={styles.confirmationText}><strong>Order Number:</strong> {orderId}</p>
        <p className={styles.confirmationText}><strong>Total Amount:</strong> BD{total}</p>
        <p className={styles.confirmationText}><strong>Email:</strong> {email}</p>
        <p className={styles.confirmationText}><strong>Phone:</strong> {phone}</p>
        <p className={styles.confirmationText}><strong>Address:</strong> {address}</p>
        <p className={styles.confirmationText}><strong>Payment Method:</strong> {paymentMethod === 'benefit' ? 'Benefit Pay' : 'Cash on Delivery'}</p>
      </div>

      <h2 className={styles.subTitle}>Ordered Items</h2>
      <div className={styles.itemList}>
        {items && items.length > 0 ? (
          JSON.parse(items).map((item, index) => (
            <div className={styles.item} key={index}>
              <img src={urlFor(item?.image[0])} className={styles.itemImage} alt={item.name} />
              <div className={styles.itemDetails}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>BD{item.price}</p>
                <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.confirmationText}>No items found.</p>
        )}
      </div>

      <p className={styles.confirmationText}>If you have any questions, please reach out to our support team.</p>
      <p className={styles.confirmationText}>Phone: +973 38233311</p>
      <p className={styles.confirmationText}>Email: crazycandybahrain@gmail.com</p>
      <p className={styles.confirmationText}>Instagram: @crazy_candy_bh</p>
    </div>
  );
};

export default OrderConfirmation;
