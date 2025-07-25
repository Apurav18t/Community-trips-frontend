import React, { useState } from 'react';

export default function TripCard({ trip }) {
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => {
    setImageIndex((imageIndex + 1) % trip.images.length);
  };

  const prevImage = () => {
    setImageIndex((imageIndex - 1 + trip.images.length) % trip.images.length);
  };

  return (
    <div style={{
      width: '300px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      position: 'relative'
    }}>
      {/* Image with navigation */}
      <div style={{ position: 'relative' }}>
        <img
          src={trip.images[imageIndex]}
          alt={trip.title}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        {trip.images.length > 1 && (
          <>
            <button onClick={prevImage} style={navButtonStyle('left')}>‹</button>
            <button onClick={nextImage} style={navButtonStyle('right')}>›</button>
          </>
        )}
      </div>

      {/* Trip details */}
      <div style={{ padding: '12px' }}>
        <h3 style={{ marginBottom: '6px' }}>{trip.title}</h3>
        <p style={{ margin: '4px 0' }}>⭐ {trip.rating} ({Math.floor(Math.random() * 100000) + 10000})</p>
        <p style={{ margin: '4px 0', color: '#555' }}>{trip.category}</p>
        <p style={{ margin: '4px 0', color: '#777' }}>{trip.location}</p>
      </div>
    </div>
  );
}

const navButtonStyle = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: '10px',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.5)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  zIndex: 1
});
