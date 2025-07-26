// Same imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ItineraryPage.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import default styles

const API_URL = "https://community-trips-backend.onrender.com";


export default function ItineraryPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [initialItinerary, setInitialItinerary] = useState('');
  const [finalItinerary, setFinalItinerary] = useState('');
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userName, setUserName] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('final');

  const [travelers, setTravelers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');

  const [stays, setStays] = useState([]);
  const [stayQuery, setStayQuery] = useState('');

  const [sightseeingQuery, setSightseeingQuery] = useState('');
  const [sightseeingResults, setSightseeingResults] = useState([]);

  const [tipsContent, setTipsContent] = useState('');
  const [tipsLoading, setTipsLoading] = useState(false);

  const formatTipsAsBullets = (tips) => {
  if (!tips) return '';
  // Split by newline or full stop and filter empty lines
  const lines = tips
    .split(/\n|\. /)
    .map(line => line.trim())
    .filter(line => line.length > 2);

  return lines.map(line => `- ${line.replace(/^- /, '')}`).join('\n');
};


  const access_token = localStorage.getItem('access_token');
  const authHeader = { headers: { Authorization: `Bearer ${access_token}` } };

  const fetchTripTips = async () => {
      try {
        setTipsLoading(true);
        const res = await axios.post(`${API_URL}/trips/tripTips`, { tripId }, authHeader);
        if (res.data.success) {
          setTipsContent(res.data.tips);
        } else {
          toast.error("Failed to load travel tips.");
        }
      } catch (err) {
        console.error("Error fetching travel tips:", err);
        toast.error("Could not fetch travel tips.");
      } finally {
        setTipsLoading(false);
      }
    };

  useEffect(() => {
    if (!tripId) {
      toast.error("No trip ID found. Redirecting to plan a trip.");
      navigate("/plan-trip");
      return;
    }

    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const tripRes = await axios.get(`${API_URL}/trips/detail?id=${tripId}`, authHeader);
        const tripData = tripRes.data?.trip || tripRes.data?.data;

        if (tripData?.itineraryData) {
          setInitialItinerary(tripData.itineraryData);
          setFinalItinerary(tripData.itineraryData);
        } else {
          const genRes = await axios.post(`${API_URL}/itinerary/generate`, { tripId }, authHeader);
          setInitialItinerary(genRes.data.data);
          setFinalItinerary(genRes.data.data);
          await axios.put(`${API_URL}/itinerary/save`, { tripId, itineraryData: genRes.data.data }, authHeader);
        }

        setTripName(tripData.tripName);
        setStartDate(tripData.startDate);
        setEndDate(tripData.endDate);
        setUserName(tripData.userName);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        toast.error("Could not load itinerary.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTravelers = async () => {
      try {
        const res = await axios.get(`${API_URL}/trips/invites?tripId=${tripId}`, authHeader);
        if (res.data.success) setTravelers(res.data.data);
      } catch (err) {
        console.error("Error fetching travelers:", err);
      }
    };

    

    fetchTripDetails();
    fetchTravelers();
    fetchTripTips();
    window.scrollTo(0, 0);
  }, [tripId, navigate]);

  const handleReGenerate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/itinerary/re-generate`, { tripId, prompt: userPrompt }, authHeader);
      setFinalItinerary(res.data.data);
      setUserPrompt('');
      await axios.put(`${API_URL}/itinerary/save`, { tripId, itineraryData: res.data.data }, authHeader);
      toast.success("Itinerary updated!");
    } catch (err) {
      console.error("Error regenerating itinerary:", err);
      toast.error("Failed to regenerate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.warning("Please enter a valid email.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/trips/inviteUser`, { email: inviteEmail, tripId }, authHeader);
      if (res.data.success) {
        toast.success("Invitation sent!");
        setInviteEmail('');
        const updated = await axios.get(`${API_URL}/trips/invites?tripId=${tripId}`, authHeader);
        if (updated.data.success) setTravelers(updated.data.data);
      } else {
        toast.error(res.data.message || "Failed to send invite.");
      }
    } catch (err) {
      console.error("Error sending invite:", err);
      toast.error("Something went wrong while sending invite.");
    }
  };
const handleDeleteTrip = () => {
  confirmAlert({
    title: 'Are you sure?',
    message: 'This action cannot be undone. It will permanently delete your trip and all data.',
    buttons: [
      {
        label: 'Delete',
        onClick: async () => {
          try {
            setLoading(true);
            const res = await axios.delete(`${API_URL}/trips/delete?id=${tripId}`, {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
              }
            });

            if (res.data.success) {
              toast.success("Trip deleted successfully.");
              navigate("/planner");
            } else {
              toast.error(res.data.message || "Failed to delete trip.");
            }
          } catch (err) {
            console.error("Error deleting trip:", err);
            toast.error("Something went wrong while deleting the trip.");
          } finally {
            setLoading(false);
          }
        }
      },
      {
        label: 'Cancel',
        onClick: () => {} // do nothing
      }
    ]
  });
};


  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const fetchLocationDetails = async (query) => {
    try {
      const res = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation', {
        params: { query },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
      });
      const loc = res.data?.data?.[0];
      return loc ? { locationId: loc.locationId, latitude: loc.latitude, longitude: loc.longitude } : null;
    } catch (err) {
      console.error("Failed to fetch location details:", err);
      return null;
    }
  };

  const handleStaySearch = async () => {
    if (!stayQuery.trim()) return;

    try {
      setLoading(true);
      const loc = await fetchLocationDetails(stayQuery);
      if (!loc) {
        toast.error("Couldn't find that location.");
        return;
      }

      const res = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotelsByLocation', {
        params: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          checkIn: startDate?.split('T')[0] || '2025-08-01',
          checkOut: endDate?.split('T')[0] || '2025-08-05',
          adults: '1',
          rooms: '1',
          currency: 'INR'
        },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
      });

      const hotelData = res.data?.data?.data;
      setStays(Array.isArray(hotelData) ? hotelData : []);
    } catch (err) {
      console.error("Error fetching stays:", err);
      toast.error("Failed to load hotel data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSightseeingSearch = async () => {
    if (!sightseeingQuery.trim()) {
      toast.warning("Please enter a location for sightseeing.");
      return;
    }

    try {
      setLoading(true);
      console.log("Searching for sightseeing in:", sightseeingQuery);

      const locRes = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/locations', {
        params: { name: sightseeingQuery, locale: 'en-gb' },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
      });

      const dest = locRes.data?.[0];
      if (!dest?.dest_id) {
        toast.error("Location not found.");
        return;
      }

      const start_date = startDate?.split('T')[0] || '2025-10-14';
      const end_date = endDate?.split('T')[0] || '2025-10-15';
      const dest_id = dest.dest_id;

      console.log("Fetching attractions with:", { start_date, end_date, dest_id });

      const atRes = await axios.get('https://booking-com.p.rapidapi.com/v1/attractions/search', {
        params: {
          start_date,
          end_date,
          dest_id,
          locale: 'en-gb',
          currency: 'INR',
          order_by: 'attr_book_score',
          page_number: '0'
        },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
      });

      const results = atRes.data?.products || [];
      if (results.length === 0) toast.info("No sightseeing attractions found.");
      setSightseeingResults(results);
    } catch (err) {
      console.error("Error fetching sightseeing:", err);
      toast.error(`Sightseeing search failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="itinerary-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="left-panel">
        <div className="itinerary-scroll-content">
          <h3>
            Hola <span style={{ color: '#6A5ACD' }}>{userName}</span> 👋,we are working on your trip: <span style={{ color: '#6A5ACD' }}>{tripName}</span>
          </h3>
          <p style={{ color: '#777' }}>Plan a memorable experience with scenic routes and local culture.</p>

          <div className="itinerary-section">
            <h4>Initial Itinerary</h4>
            {loading ? <p>Loading itinerary...</p> : <ReactMarkdown>{initialItinerary}</ReactMarkdown>}
          </div>
        </div>

        <div className="chatbox">
          <p>Hi! I am ASG. Let’s curate a wonderful experience.</p>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Share your trip requirements, changes, or preferences..."
            rows="3"
          />
          <button onClick={handleReGenerate}>Submit</button>
        </div>
      </div>

      <div className="right-panel">
        <h4>{tripName || 'Your Trip'}</h4>
        <p className="date-range">
          {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : ''}
        </p>

        <div className="tab-buttons">
          <button className={activeTab === 'final' ? 'active-tab' : ''} onClick={() => setActiveTab('final')}>Final Itinerary</button>
          <button className={activeTab === 'travelers' ? 'active-tab' : ''} onClick={() => setActiveTab('travelers')}>Travelers</button>
          <button className={activeTab === 'sightseeing' ? 'active-tab' : ''} onClick={() => setActiveTab('sightseeing')}>Sightseeing</button>
          <button className={activeTab === 'stays' ? 'active-tab' : ''} onClick={() => setActiveTab('stays')}>Stays</button>
          <button className={activeTab === 'tips' ? 'active-tab' : ''} onClick={() => setActiveTab('tips')}>Travel Tips</button>
        </div>
<button
          onClick={handleDeleteTrip}
          className="delete-trip-button"
          style={{
            backgroundColor: 'crimson',
            color: 'white',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Delete Trip
        </button>
        <div className="tab-content">
          {activeTab === 'final' && (loading ? <p>Loading itinerary...</p> : <ReactMarkdown>{finalItinerary}</ReactMarkdown>)}

          {activeTab === 'travelers' && (
            <div className="travelers-tab">
              <h5>Travelers Who Have Joined:</h5>
              <ul>
                {travelers.filter(t => t.invitedAccepted === 'accepted').map((t, i) => (
                  <li key={i}><strong>{t.inviteSendTo}</strong></li>
                ))}
              </ul>
              {travelers.filter(t => t.invitedAccepted === 'pending').length > 0 && <p>Some invites are still pending...</p>}
              <div className="invite-form" style={{ marginTop: "1rem" }}>
                <input type="email" placeholder="Invite user by email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                <button onClick={handleInvite}>Invite</button>
              </div>
            </div>
          )}

          {activeTab === 'sightseeing' && (
            <div className="sightseeing-tab">
              <input type="text" placeholder="Enter city for sightseeing (e.g., Delhi)" value={sightseeingQuery} onChange={(e) => setSightseeingQuery(e.target.value)} />
              <button onClick={handleSightseeingSearch}>Search Attractions</button>
              {loading && <p>Loading sightseeing...</p>}
              {!loading && sightseeingResults.length > 0 ? (
                <div className="sightseeing-grid">
                  {sightseeingResults.map((sight, i) => (
                    <div className="sight-card" key={i}>
                      {sight.primaryPhoto?.small && (
                        <img
                          src={sight.primaryPhoto.small}
                          alt={sight.name}
                          loading="lazy"
                          style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                        />
                      )}
                      <div style={{ padding: '0.5rem' }}>
                        <h6 style={{ marginBottom: '0.25rem' }}>{sight.name}</h6>
                        <p style={{ color: '#666' }}>{sight.ufiDetails?.bCityName || 'Unknown City'}</p>
                        <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>{sight.shortDescription || 'No description available.'}</p>
                        <p>⭐ {sight.reviewsStats?.combinedNumericStats?.average || 'N/A'} ({sight.reviewsStats?.combinedNumericStats?.total || 0} reviews)</p>
                        <p><strong>₹{sight.representativePrice?.chargeAmount?.toFixed(0) || 'N/A'}</strong></p>
                      </div>
                    </div>

                  ))}
                </div>
              ) : (
                !loading && <p>No sightseeing results found.</p>
              )}
            </div>
          )}

          {activeTab === 'stays' && (
            <div className="stays-tab">
              <input
                type="text"
                placeholder="Enter location for hotels (e.g. Bengaluru)"
                value={stayQuery}
                onChange={(e) => setStayQuery(e.target.value)}
              />
              <button onClick={handleStaySearch}>Search Hotels</button>
              {loading && <p>Loading stays...</p>}
              {!loading && stays.length > 0 ? (
                <div className="stays-grid">
                  {stays.map((stay, i) => (
                    <div className="stay-card" key={i}>
                      <div className="stay-img">
                        <img
                          src={stay.cardPhotos?.[0]?.sizes?.urlTemplate?.replace('{width}', '300').replace('{height}', '200')}
                          alt={stay.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="stay-details">
                        <h6>{stay.title}</h6>
                        <p>{stay.primaryInfo}</p>
                        <p>{stay.secondaryInfo}</p>
                        <p className="stay-rating">
                          ⭐ {stay.bubbleRating?.rating || 'N/A'} ({stay.bubbleRating?.count || '0'} reviews)
                        </p>
                        <p className="stay-price">{stay.priceForDisplay || 'Price not available'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && <p>No stays found.</p>
              )}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tips-tab">
             {tipsLoading ? (
  <p>Loading travel tips…</p>
) : tipsContent ? (
  <ReactMarkdown>{formatTipsAsBullets(tipsContent)}</ReactMarkdown>
) : (
  <p>No travel tips available for this trip.</p>
)}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
