// components/MapEmbed.js
import React from 'react';

const MapEmbed = () => {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3577.7097095263603!2d50.609119475417614!3d26.271083277035437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDE2JzE1LjkiTiA1MMKwMzYnNDIuMSJF!5e0!3m2!1sen!2sbh!4v1725887517148!5m2!1sen!2sbh"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
