// TripsDrawer.js
import React from 'react';
import TripsPage from './TripsPage';

export default function TripsDrawer({ type, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <span>{type.charAt(0).toUpperCase() + type.slice(1)} Trips</span>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <TripsPage type={type} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-start'
  },
  drawer: {
    width: '400px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  closeBtn: {
    fontSize: '1.5rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  }
};
