import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TripsDrawer from './TripsDrawer'; // 🆕 Drawer component

export default function Sidebar({ selectedPage }) {
  const [showTrips, setShowTrips] = useState(false);
  const [drawerInfo, setDrawerInfo] = useState(null); // 👉 this controls the drawer
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccountSettings = () => {
    try {
      const userRaw = localStorage.getItem('user');
      if (!userRaw || userRaw === "undefined" || userRaw === "null") {
        alert("User not logged in.");
        navigate('/signin');
        return;
      }

      const user = JSON.parse(userRaw);
      if (!user || !user._id) {
        alert("Invalid user.");
        localStorage.removeItem("user");
        navigate('/signin');
        return;
      }

      navigate('/account-settings');
    } catch (err) {
      console.error("Error parsing user:", err);
      localStorage.removeItem("user");
      navigate('/signin');
    }
  };

  return (
    <>
      <div style={{
        width: '220px',
        background: '#fff',
        borderRight: '1px solid #eee',
        padding: '20px'
      }}>
        <h2
          style={{ marginBottom: '30px', cursor: 'pointer' }}
          onClick={() => navigate('/planner')}
        >
          CommunityTrips
        </h2>

        <div
          style={{ marginBottom: '15px', fontWeight: '600', cursor: 'pointer' }}
          onClick={() => setShowTrips(!showTrips)}
        >
          Trips {showTrips ? '▾' : '▸'}
        </div>

        {showTrips && (
          <div style={{ marginLeft: '10px' }}>
            <div style={linkStyle(false)} onClick={() => setDrawerInfo({ open: true, type: 'current' })}>My Current Trips</div>
            <div style={linkStyle(false)} onClick={() => setDrawerInfo({ open: true, type: 'upcoming' })}>Upcoming Trips</div>
            <div style={linkStyle(false)} onClick={() => setDrawerInfo({ open: true, type: 'past' })}>Past Trips</div>
            <div style={linkStyle(false)} onClick={() => setDrawerInfo({ open: true, type: 'all' })}>All Trips</div>
          </div>
        )}

        <div style={linkStyle(location.pathname === '/explore')} onClick={() => navigate('/explore')}>
          Explore
        </div>
        <div style={linkStyle(location.pathname === '/notifications')} onClick={() => navigate('/notifications')}>
          Notifications
        </div>
        <div style={linkStyle(location.pathname === '/account-settings')} onClick={handleAccountSettings}>
          Account Settings
        </div>
      </div>

      {/* 🎯 Show Trips Drawer only when needed */}
      {drawerInfo?.open && (
        <TripsDrawer
          type={drawerInfo.type}
          onClose={() => setDrawerInfo(null)}
        />
      )}
    </>
  );
}

const linkStyle = (active) => ({
  marginBottom: '12px',
  cursor: 'pointer',
  color: active ? '#000' : '#555',
  fontWeight: 600
});
