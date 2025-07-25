import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`http://localhost:6969/trips/detail?id=${id}`);
        const data = await res.json();
        console.log("Trip fetched:", data);
        if (data.success) {
          const tripData = data.data.trip || data.data; // flexible
          setTrip(tripData);
          setRecommendations(data.data.recommendations || []);
        } else {
          console.error("Trip not found:", data.message);
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading your itinerary...</div>;
  if (!trip) return <div style={styles.loading}>Sorry, trip not found.</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.greeting}>
        Hey Apurav Uppal! 🎉 Here’s your plan for <span style={styles.tripName}>{trip.tripName}</span>
      </h2>

      {recommendations.length > 0 ? (
        <div style={styles.cardsWrapper}>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={styles.card}>
              <h3 style={styles.locationName}>{rec.location}</h3>
              <p style={styles.bestTime}><strong>Best Time to Visit:</strong> {rec.bestTimeToVisit}</p>
              <div style={styles.placesBox}>
                <p style={styles.placesTitle}>Famous Places to Visit:</p>
                <ul style={styles.placesList}>
                  {rec.famousPlaces.map((place, i) => (
                    <li key={i}>✅ {place}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noItinerary}>No itinerary details found for this trip.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  greeting: {
    fontSize: "28px",
    marginBottom: "30px",
    textAlign: "center",
  },
  tripName: {
    color: "#007BFF",
    fontWeight: "600",
  },
  cardsWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  locationName: {
    fontSize: "22px",
    color: "#444",
    marginBottom: "8px",
    borderBottom: "2px solid #007BFF",
    display: "inline-block",
    paddingBottom: "3px",
  },
  bestTime: {
    fontSize: "16px",
    margin: "10px 0",
  },
  placesBox: {
    marginTop: "12px",
  },
  placesTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  placesList: {
    paddingLeft: "20px",
    lineHeight: "1.6",
  },
  noItinerary: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "40px",
    color: "#555",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    marginTop: "50px",
    color: "#333",
  },
};
