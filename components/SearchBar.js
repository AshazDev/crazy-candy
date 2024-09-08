import React from 'react';
import styles from './SearchBar.module.css'; // Import the CSS module for styles

const SearchBar = ({ value, onChange }) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={onChange}
        className={styles.searchBar}
      />
    </div>
  );
};

export default SearchBar;
