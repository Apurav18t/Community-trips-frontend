import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripForm.css";

const TripForm = () => {
  const [form, setForm] = useState({
    startLocation: "",
    destinations: [""],
    isRoadTrip: false,
    startDate: "",
    endDate: "",
    tripBudget: "",
    tripDescription: "",
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [loading, setLoading] = useState(false); // ⏳ Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...form.destinations];
    newDestinations[index] = value;
    setForm({ ...form, destinations: newDestinations });
  };

  const addDestination = () => {
    setForm({ ...form, destinations: [...form.destinations, ""] });
  };

  const removeDestination = (index) => {
    const newDestinations = form.destinations.filter((_, i) => i !== index);
    setForm({ ...form, destinations: newDestinations });
  };

  const handleTravellerChange = (type, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + (type === "increment" ? 1 : -1)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔄 Start loader

    const user = JSON.parse(localStorage.getItem("user"));
    const access_token = localStorage.getItem("access_token");
    const userId = user?.id || user?._id;

    if (!userId || !access_token) {
      alert("User not logged in or token missing.");
      setLoading(false);
      return;
    }

    const payload = {
      tripName: `${form.startLocation} to ${form.destinations.filter(Boolean).join(", ")}`,
      tripDescription: form.tripDescription.trim() || "Trip planned.",
      startDate: form.startDate,
      endDate: form.endDate,
      tripBudget: Number(form.tripBudget),
      locations: form.destinations
        .filter(dest => dest.trim())
        .map(loc => ({ locationName: loc })),
      numberOfAdults: form.adults,
      numberOfChildern: form.children,
      numberOfInfants: form.infants,
      numberOfPets: form.pets,
      addedBy: userId,
      isRoadTrip: form.isRoadTrip
    };

    try {
      const response = await fetch("http://localhost:6969/trips/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("trip", JSON.stringify(data.data));

        try {
          const locationsStr = payload.locations.map(l => l.locationName).join(", ");
          const recResponse = await fetch("http://localhost:6969/trips/generate-highlight", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({ locations: locationsStr })
          });

          const recData = await recResponse.json();
          if (recData.success) {
            localStorage.setItem("recommendations", JSON.stringify(recData.data));
          }
        } catch (err) {
          console.warn("Failed to get recommendations:", err);
        }

        navigate("/tripvibe");
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false); // ✅ End loader
    }
  };

  return (
    <div className="trip-form-container">
      <form className="trip-form-card" onSubmit={handleSubmit}>
        <h2>Plan a Trip</h2>

        <div className="trip-form-group">
          <label>Travelling From</label>
          <input
            type="text"
            name="startLocation"
            value={form.startLocation}
            onChange={handleChange}
            required
            placeholder="City or airport"
          />
        </div>

        <div className="trip-form-group">
          <label>Destinations</label>
          {form.destinations.map((dest, index) => (
            <div key={index} className="destination-field">
              <input
                type="text"
                value={dest}
                onChange={(e) => handleDestinationChange(index, e.target.value)}
                placeholder={`Destination ${index + 1}`}
                required
              />
              {form.destinations.length > 1 && (
                <button type="button" onClick={() => removeDestination(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDestination}>
            + Add Destination
          </button>
        </div>

        <div className="trip-form-dates">
          <div className="trip-form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
               min={new Date().toISOString().split("T")[0]} // ✅ Prevent past dates
            />
          </div>
          <div className="trip-form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
                  min={form.startDate || new Date().toISOString().split("T")[0]} // ✅ End date cannot be before start date


            />
          </div>
        </div>

        <div className="trip-form-group">
          <label>Budget (₹)</label>
          <input
            type="number"
            name="tripBudget"
            value={form.tripBudget}
            onChange={handleChange}
            required
            placeholder="Enter budget"
          />
        </div>

        <div className="trip-form-group">
          <label>Travellers</label>
          <div className="trip-form-travellers">
            {["adults", "children", "infants", "pets"].map((type) => (
              <div key={type} className="traveller-counter">
                <span>{type}</span>
                <div>
                  <button
                    type="button"
                    onClick={() => handleTravellerChange("decrement", type)}
                  >
                    −
                  </button>
                  <span>{form[type]}</span>
                  <button
                    type="button"
                    onClick={() => handleTravellerChange("increment", type)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trip-form-group">
          <label>Notes (Optional)</label>
          <textarea
            name="tripDescription"
            value={form.tripDescription}
            onChange={handleChange}
            placeholder="Preferences or needs..."
          ></textarea>
        </div>

        <div className="trip-form-group checkbox-group">
          <input
            type="checkbox"
            name="isRoadTrip"
            checked={form.isRoadTrip}
            onChange={handleChange}
            id="roadtrip"
          />
          <label htmlFor="roadtrip">This is a road trip</label>
        </div>

        <button
          className="trip-form-submit"
          type="submit"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Planning..." : "Plan My Trip"}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
