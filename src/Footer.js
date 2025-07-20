import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#000000',
      color: '#fff',
      padding: '30px 20px',
      textAlign: 'center',
      fontSize: '14px'
    }}>
      <p>© {new Date().getFullYear()} Community Trips. All rights reserved.</p>
      <p style={{ marginTop: '10px' }}>
        <a href="#" style={linkStyle}>Privacy Policy</a> | 
        <a href="#" style={linkStyle}> Terms</a> | 
        <a href="#" style={linkStyle}> Contact</a>
      </p>
    </footer>
  );
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  margin: '0 10px',
};

export default Footer;
