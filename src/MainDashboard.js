import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Your Next Great Adventure Starts Here!</h1>
      <p>Turn your dreams into journeys with <strong>CommunityTrips</strong></p>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => navigate('/create-trip')}
          style={{
            background: '#000',
            color: '#fff',
            padding: '12px 30px',
            borderRadius: '25px',
            marginRight: '20px'
          }}
        >
          Create a Trip
        </button>
        <button
          style={{
            background: '#f5f5f5',
            padding: '12px 30px',
            borderRadius: '25px'
          }}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
