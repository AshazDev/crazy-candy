import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './Checkout.module.css';
import { urlFor } from '../lib/client';

const storage = getStorage();

const Checkout = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cash',
  });
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartVisible, setCartVisible] = useState(true);

  useEffect(() => {
    if (router.query.cartItems) {
      const parsedItems = JSON.parse(router.query.cartItems);
      setItems(parsedItems);
      setTotal(parseFloat(router.query.totalPrice));
    }
  }, [router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (image) {
      try {
        const imageRef = ref(storage, `benefitImages/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        return url;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image.');
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImageUrl = await uploadImage();

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      items,
      total,
      createdAt: new Date(),
      imageUrl: uploadedImageUrl,
    };

    try {
      const ordersCollection = collection(db, 'orders');
      const docRef = await addDoc(ordersCollection, orderData);
      toast.success('Order placed successfully!');

      setCartVisible(false);
      router.push(`/order-confirmation?orderId=${docRef.id}&name=${formData.name}&phone=${formData.phone}&email=${formData.email}&address=${formData.address}&paymentMethod=${formData.paymentMethod}&items=${JSON.stringify(items)}&total=${total}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <h1 className={styles.title}>Checkout</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="paymentMethod" className={styles.label}>Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="cash">Cash on Delivery</option>
            <option value="benefit">Benefit Pay (+973 3964 1454)</option>
          </select>
        </div>
        {formData.paymentMethod === 'benefit' && (
          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>Upload Benefit Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </div>
        )}

        {cartVisible && (
          <>
            <div className={styles.itemList}>
              <h2 className={styles.subTitle}>Items</h2>
              {items.length === 0 ? (
                <p>No items added.</p>
              ) : (
                items.map((item, index) => (
                  <div className={styles.item} key={index}>
                    <img src={urlFor(item?.image[0])} className={styles.itemImage} alt={item.name} />
                    <div className={styles.itemDetails}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>BD{item.price}</p>
                      <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className={styles.total}>
              <h2 className={styles.subTitle}>Total</h2>
              <p>BD{total.toFixed(2)}</p>
            </div>
          </>
        )}

        <button type="submit" className={styles.submitButton}>Submit Order</button>
      </form>
    </div>
  );
};

export default Checkout;
