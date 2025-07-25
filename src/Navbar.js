import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 30px',
      backgroundColor: '#000000',
      color: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h2 style={{ margin: 0 }}>Community Trips</h2>
      <ul style={{
        display: 'flex',
        gap: '20px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        fontSize: '16px'
      }}>
        <li><Link to="/signin" style={linkStyle}>LOGIN</Link></li>
        <li><Link to="/signup" style={linkStyle}>GET STARTED</Link></li>
      </ul>
    </nav>
  );
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  transition: 'color 0.2s',
  fontWeight: 500
};

export default Navbar;
