import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//const API_URL = "http://localhost:6969";
 const API_URL = "https://community-trips-backend.onrender.com";

export default function TripVibe() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedVibes, setSelectedVibes] = useState({});
  const [tripType, setTripType] = useState(""); // ✅ NEW STATE
  const [loading, setLoading] = useState(false); // ⏳ loader

  const tripTypeOptions = [
    "Romantic Trip",
    "Family Trip",
    "Honeymoon Trip",
    "Trip with Friends",
    "Group Trip",
    "Solo Trip",
  ];

  useEffect(() => {
    try {
      const tripData = JSON.parse(localStorage.getItem("trip"));
      const recsData = JSON.parse(localStorage.getItem("recommendations"));
      console.log("🗂 Loaded from localStorage:", { tripData, recsData });

      if (!tripData || tripData === "undefined" || (!tripData._id && !tripData.id)) {
        toast.warning("No trip found. Please plan your trip first.");
        navigate("/plan-trip");
        return;
      }

      setTrip(tripData);

      if (recsData && recsData !== "undefined") {
        setRecommendations(recsData);
        const initial = {};
        recsData.forEach((loc) => {
          initial[loc.location] = [];
        });
        setSelectedVibes(initial);
      }
    } catch (err) {
      console.error("❌ Error parsing localStorage JSON:", err);
      toast.error("Something went wrong loading your trip. Please try again.");
    }
  }, [navigate]);

  const togglePlace = (location, place) => {
    setSelectedVibes((prev) => {
      const current = prev[location] || [];
      return {
        ...prev,
        [location]: current.includes(place)
          ? current.filter((p) => p !== place)
          : [...current, place],
      };
    });
  };

  const handleCreateItinerary = async () => {
    if (loading) return;

    const tripId = trip?._id || trip?.id;
    const access_token = localStorage.getItem("access_token");

    if (!tripId) {
      toast.warning("Trip details missing. Please plan your trip again.");
      navigate("/plan-trip");
      return;
    }

    if (!access_token) {
      toast.error("Authentication token missing. Please login again.");
      navigate("/login");
      return;
    }

    if (!tripType) {
      toast.warning("Please select a trip type.");
      return;
    }

    setLoading(true); // ⏳ start loading

    try {
      console.log("🚀 Sending to itinerary:", { tripId, selectedVibes, tripType });
      localStorage.setItem("selectedVibes", JSON.stringify(selectedVibes));
      localStorage.setItem("tripType", tripType); // ✅ store trip type if needed later

      const response = await fetch(`${API_URL}/itinerary/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ tripId, selectedVibes, tripType }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Server responded with ${response.status}:`, text);
        toast.error("Failed to generate itinerary. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("✅ Itinerary Response:", data);

      if (data.success) {
        navigate(`/trip/itinerary/${tripId}`);
      } else {
        toast.error("Failed to generate itinerary. Server error.");
      }
    } catch (err) {
      console.error("❌ Error creating itinerary:", err);
      toast.error("Something went wrong while creating the itinerary.");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "30px auto",
        padding: "20px",
        background: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} />

     <h2 style={{ marginBottom: "20px", fontSize: "24px", textAlign: "center" }}>
  What's your trip vibe for{" "}
  {trip?.tripName?.trim()
    ? trip.tripName
    : `${trip?.startLocation || "Unknown"} to ${
        trip?.locations?.map((l) => l.locationName).join(", ") || "Unknown"
      }`}
  ?
</h2>


      {/* ✅ TRIP TYPE SELECTOR */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Select Trip Type</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {tripTypeOptions.map((type) => (
            <button
              key={type}
onClick={() => {
  setTripType(type);
  const existingTrip = JSON.parse(localStorage.getItem("trip")) || {};
  const updatedTrip = { ...existingTrip, tripType: type };
  localStorage.setItem("trip", JSON.stringify(updatedTrip));
  setTrip(updatedTrip); // ✅ update React state too
}}
              style={{
                padding: "10px 16px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background: tripType === type ? "#4caf50" : "#e0e0e0",
                color: tripType === type ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ RECOMMENDATIONS */}
      {recommendations.length > 0 ? (
        recommendations.map((rec, idx) => (
          <div key={idx} style={{ marginBottom: "25px" }}>
            <h3 style={{ marginBottom: "5px", fontSize: "20px" }}>{rec.location}</h3>
            <p style={{ marginBottom: "10px", color: "#555" }}>
              <strong>Best Time:</strong> {rec.bestTimeToVisit}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {(rec.famousPlaces || []).map((place, i) => {
                const isSelected = selectedVibes[rec.location]?.includes(place);
                return (
                  <span
                    key={i}
                    style={{
                      padding: "8px 12px",
                      background: isSelected ? "#4f46e5" : "#e0e0e0",
                      color: isSelected ? "white" : "black",
                      borderRadius: "50px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => togglePlace(rec.location, place)}
                  >
                    {place}
                  </span>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p>No recommendations found. Please plan a trip first.</p>
      )}

      {/* ✅ SUBMIT BUTTON */}
      <button
        style={{
          marginTop: "30px",
          display: "block",
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          background: loading ? "#999" : "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
        onClick={handleCreateItinerary}
        disabled={loading}
      >
        {loading ? "Creating Itinerary..." : "Create Itinerary"}
      </button>
    </div>
  );
}
