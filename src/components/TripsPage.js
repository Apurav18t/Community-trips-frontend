// TripsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripsPage.css';
const API_URL = "https://community-trips-backend.onrender.com";
//const API_URL = "http://localhost:6969";


export default function TripsPage({ type = 'all' }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);

      try {
        const userData = localStorage.getItem("user");
        if (!userData || userData === "undefined") throw new Error("User not logged in.");

        const user = JSON.parse(userData);
        const userId = user._id || user.id;
        const token = user.access_token;
        if (!userId || !token) throw new Error("Missing user credentials.");

        let url =
          type === 'current' || type === 'upcoming' || type === 'past'
            ? `${API_URL}/trips/getFilterTrips?addedBy=${userId}&type=${type}`
            : `${API_URL}/trips/list?addedBy=${userId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Include JWT token
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load trips");
        }

        setTrips((data.data || []).filter(trip => !trip.isDeleted));

      } catch (err) {
        console.error("Trip fetching error:", err);
        setError(err.message || "Something went wrong while fetching your trips.");
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [type]);

  const getTitle = () => {
    switch (type) {
      case 'current':
        return "My Current Trips";
      case 'upcoming':
        return "My Upcoming Trips";
      case 'past':
        return "My Past Trips";
      default:
        return "My Trips";
    }
  };

  return (
    <div className="trips-page">
      <h2>{getTitle()}</h2>

      {loading ? (
        <p>Loading trips...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => {
  console.log("trip object:", trip);
            const totalTravellers =
              (trip.numberOfAdults || 0) +
              (trip.numberOfChildern || 0) +
              (trip.numberOfInfants || 0) +
              (trip.numberOfPets || 0);

            return (
              <div
                className="trip-card"
                key={trip.id}
                onClick={() => navigate(`/trip/itinerary/${trip.id}`)}
              >
                <div className="trip-details">
                  <h4>{trip.tripName || 'Untitled Trip'}</h4>
                  <p className="trip-dates">
                    {trip.startDate && trip.endDate
                      ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
                      : 'No dates'}
                  </p>
                  <div className="trip-tags">
                    <span>{totalTravellers} travelers</span>
                    <span>Budget: ₹{trip.tripBudget || 'N/A'}</span>
                  </div>
                </div>
                <button className="view-btn">View</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
