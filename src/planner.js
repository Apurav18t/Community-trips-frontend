import React, { useEffect, useState } from 'react';
import TripDetails from './TripDetails'; // new component
const API_URL = "http://localhost:6969";
//const API_URL = "https://community-trips-backend.onrender.com";

export default function PlannerPage({ tripType = 'current' }) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id || user?.id;
        let url = "";

        if (tripType === 'upcoming') {
          url = `${API_URL}/trips/getFilterTrips?type=upcoming&addedBy=${userId}`;
        } else if (tripType === 'past') {
          url = `${API_URL}/trips/getFilterTrips?type=past&addedBy=${userId}`;
        } else {
          url = `${API_URL}/trips/getFilterTrips?type=current&addedBy=${userId}`;
        }

        console.log("🌐 Fetching trips:", url);
        const response = await fetch(url);
        const data = await response.json();
        setTrips(data.data || []);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    };
    fetchTrips();
  }, [tripType]);

  if (selectedTrip) {
    return <TripDetails trip={selectedTrip} onBack={() => setSelectedTrip(null)} />;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{ width: '100%' }}>
        <h2 style={{ marginBottom: '20px' }}>
          {tripType === 'current' && 'My Current Trips'}
          {tripType === 'upcoming' && 'Upcoming Trips'}
          {tripType === 'past' && 'Past Trips'}
        </h2>
      </div>

      {trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        trips.map((trip, index) => (
          <div
            key={index}
            onClick={() => setSelectedTrip(trip)}
            style={{
              width: '260px',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '15px',
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h4 style={{ marginBottom: '8px' }}>{trip.tripName || 'Untitled Trip'}</h4>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              {new Date(trip.startDate).toLocaleDateString()} - 
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Budget: ₹{trip.tripBudget}</p>
          </div>
        ))
      )}
    </div>
  );
}
