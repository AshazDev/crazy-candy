import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css'; // Adjust the path as needed

const AdminAuth = ({ children }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = sessionStorage.getItem('adminAuth');
      setIsAuthenticated(authStatus === 'true');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'CrazyAdmin' && password === 'crazycandy123') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      router.push('/admin'); // Redirect to the admin page
    } else {
      setError('Invalid username or password');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginForm}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
