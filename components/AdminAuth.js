import React, { useState } from 'react';
import { useRouter } from 'next/router';

const AdminAuth = ({ children }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple authentication check (replace with your own credentials)
    if (username === 'admin' && password === 'password') {
      sessionStorage.setItem('adminAuth', 'true');
      router.push('/admin'); // Redirect to the admin page
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      {sessionStorage.getItem('adminAuth') ? (
        <>{children}</>
      ) : (
        <div className="login-form">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminAuth;
