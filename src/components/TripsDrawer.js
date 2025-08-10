import React, { useState } from 'react';
import TripsPage from './TripsPage';

export default function TripsDrawer({ onClose }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = ['upcoming', 'current', 'past', 'all'];

  const formatLabel = (label) =>
    label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <span>My Trips</span>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabButton,
                borderBottom: activeTab === tab ? '2px solid #000' : 'none',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
              }}
            >
              {formatLabel(tab)}
            </button>
          ))}
        </div>

        <div style={styles.content}>
          <TripsPage type={activeTab} />
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
  },
  tabs: {
    display: 'flex',
    justifyContent: 'space-around',
    borderBottom: '1px solid #ddd'
  },
  tabButton: {
    flex: 1,
    padding: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px'
  }
};
