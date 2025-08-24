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
//const API_URL = "http://localhost:6969";


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

  const [autoSightseeing, setAutoSightseeing] = useState({});
const [autoStays, setAutoStays] = useState({});


  const [tipsContent, setTipsContent] = useState('');
  const [tipsLoading, setTipsLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]); // ⬅️ To hold full conversation
const userId = localStorage.getItem("userId");


   const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

   // ✨ Greeting Support
  const greetings = ['Hola', 'Namaste', 'Bonjour', 'Ciao', 'Hello', 'Sat Sri Akal', 'Salam', 'Hej', 'Hallo', 'Konnichiwa', 'Ni Hao'];
  const [greetingWord, setGreetingWord] = useState('Namaste');

  useEffect(() => {
  const interval = setInterval(() => {
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    setGreetingWord(randomGreet);
  }, 10000); // Change greeting every 15 seconds

  return () => clearInterval(interval); // Cleanup
}, []);


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
  
 const fetchWeatherData = async (cityName, startDate, endDate) => {
  if (!cityName || !startDate || !endDate) return;

  try {
    setWeatherLoading(true);
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    // Calculate trip length
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tripLength = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const res = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${tripLength}`
    );

    setWeatherData(res.data);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    toast.error("Weather information could not be loaded.");
  } finally {
    setWeatherLoading(false);
  }
};



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

     // 👋 Set random greeting
   

    
const fetchTripDetails = async () => {
  try {
    setLoading(true);

    // 1. Fetch trip details
    const tripRes = await axios.get(`${API_URL}/trips/detail?id=${tripId}`, authHeader);
    const tripData = tripRes.data?.trip || tripRes.data?.data;

    // 2. Fetch itinerary history
    const historyRes = await axios.get(`${API_URL}/itinerary/list`, {
      params: { tripId, userId },
      ...authHeader
    });

    const historyItems = Array.isArray(historyRes.data.data) ? historyRes.data.data : [];

    if (historyRes.data.success && historyItems.length > 0) {
      // 3. Set chat history
      const chatHistoryFormatted = historyItems
  .filter(item => item.promptUsed !== "Initial itinerary generated from trip form")
  .map(item => ([
    { isUser: true, message: item.promptUsed },
    { isUser: false, message: item.itineraryData }
  ]))
  .flat();
setChatHistory(chatHistoryFormatted);

// ✅ Extract and show the initial itinerary
const initialItineraryEntry = historyItems.find(
  item => item.promptUsed === "Initial itinerary generated from trip form"
);
if (initialItineraryEntry?.itineraryData) {
  setInitialItinerary(initialItineraryEntry.itineraryData);
}

      // 4. Get latest AI-generated itinerary (sorted by createdAt descending)
      const aiResponsesSorted = historyItems
        .filter(item => item.itineraryData && !item.isUser)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const latestAIMessage = aiResponsesSorted[0]?.itineraryData;
      setFinalItinerary(latestAIMessage || '');

    } else if (tripData?.itineraryData) {
      // 5. Fallback if no chat history, use tripData
      setInitialItinerary(tripData.itineraryData);
      setFinalItinerary(tripData.itineraryData);
    } else {
      // 6. Only generate and save if "initial itinerary" not already saved
      const alreadyExists = historyItems.some(item =>
        item.promptUsed === "Initial itinerary generated from trip form"
      );

      if (!alreadyExists) {
  const storedTrip = JSON.parse(localStorage.getItem("trip"));
  const tripType = storedTrip?.tripType || "Honeymoon Trip";

  const genRes = await axios.post(`${API_URL}/itinerary/generate`, {
    tripId,
    tripType
  }, authHeader);

        const generatedItinerary = genRes.data.data;

        setInitialItinerary(generatedItinerary);
        setFinalItinerary(generatedItinerary);

        await axios.post(`${API_URL}/itinerary/save`, {
          tripId,
          itineraryData: generatedItinerary,
          promptUsed: "Initial itinerary generated from trip form",
          userId
        }, authHeader);
      }
    }
        setTripName(tripData.tripName);
        setStartDate(tripData.startDate);
        setEndDate(tripData.endDate);
        setUserName(tripData.userName);
const storedTrip = JSON.parse(localStorage.getItem("trip"));
const destinationList = (
  storedTrip?.locations?.length ? storedTrip.locations : tripData?.locations || []
).map(loc => loc.locationName);

console.log("Auto fetching cities:", destinationList); // 👈 Add this line here

destinationList.forEach((city) => {
  autoFetchSightseeing(city);
  autoFetchStays(city);
});

        // ✅ Call weather fetch here
fetchWeatherData(tripData.tripName || "Delhi", tripData.startDate, tripData.endDate);
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
  if (!userPrompt.trim() || !finalItinerary) {
    toast.error("Prompt or existing itinerary missing.");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(`${API_URL}/itinerary/re-generate`, {
      tripId,
      prompt: userPrompt,
      userId,
       itineraryMarkdown: finalItinerary
    }, authHeader);

    const newAIResponse = res.data.data;

    setFinalItinerary(newAIResponse);

    setChatHistory(prev => [
      ...prev,
      { isUser: true, message: userPrompt },
      { isUser: false, message: newAIResponse }
    ]);

    await axios.post(`${API_URL}/itinerary/save`, {
      tripId,
      itineraryData: newAIResponse,
      promptUsed: userPrompt,
      userId
    }, authHeader);

    setUserPrompt('');
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

  const alreadyInvited = travelers.some(t => t.inviteSendTo === inviteEmail);
  if (alreadyInvited) {
    toast.error("User is already in the trip.");
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

  const autoFetchSightseeing = async (city) => {
  try {
    const locRes = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/locations', {
      params: { name: city, locale: 'en-gb' },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    });

    const dest = locRes.data?.[0];
    if (!dest?.dest_id) return;

    const start_date = startDate?.split('T')[0] || '2025-10-14';
    const end_date = endDate?.split('T')[0] || '2025-10-15';

    const atRes = await axios.get('https://booking-com.p.rapidapi.com/v1/attractions/search', {
      params: {
        start_date,
        end_date,
        dest_id: dest.dest_id,
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

    const attractions = atRes.data?.products || [];

    setAutoSightseeing(prev => ({
      ...prev,
      [city]: attractions
    }));
  } catch (err) {
    console.error(`Auto sightseeing fetch failed for ${city}:`, err);
  }
};

const autoFetchStays = async (city) => {
  try {
    const loc = await fetchLocationDetails(city);
    if (!loc) return;

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

    setAutoStays(prev => ({
      ...prev,
      [city]: hotelData || []
    }));
  } catch (err) {
    console.error(`Auto stays fetch failed for ${city}:`, err);
  }
};

  return (
    <div className="itinerary-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="left-panel">
        <div className="itinerary-scroll-content">
          <h3>
 {greetingWord} <span style={{ color: '#2e7d32' }}>{userName}</span> 👋,
            we are working on your trip: <span style={{ color: '#2e7d32' }}>{tripName}</span>          </h3>
          <p style={{ color: '#777' }}>Plan a memorable experience with scenic routes and local culture.</p>

        <div className="itinerary-section">
  <h4>Initial Itinerary</h4>
  {loading ? (
    <p>Loading itinerary...</p>
  ) : (
    <>
      {initialItinerary && (
        <div className="chat-bubble ai">
          <ReactMarkdown>{initialItinerary}</ReactMarkdown>
        </div>
      )}

      {chatHistory.map((entry, idx) => (
        <div
          key={idx}
          className={entry.isUser ? 'chat-bubble user' : 'chat-bubble ai'}
        >
          <ReactMarkdown>{entry.message}</ReactMarkdown>
        </div>
      ))}
    </>
  )}
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
<button onClick={handleReGenerate} disabled={loading}>
  {loading ? <span className="loader"></span> : 'Submit'}
</button>
        </div>
      </div>

      <div className="right-panel">
        <h4>{tripName || 'Your Trip'}</h4>
        <p className="date-range">
          {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : ''}
        </p>

{/* Weather Section */}
        <div className="weather-section" style={{ marginBottom: '1rem' }}>
     {weatherLoading ? (
  <p>Loading weather...</p>
) : weatherData ? (
  <div className="weather-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <img
      src={weatherData.current.condition.icon}
      alt={weatherData.current.condition.text}
      title={weatherData.current.condition.text}
      style={{ width: '50px', height: '50px' }}
    />
    <div>
      <strong>{weatherData.location.name}</strong>
      <p style={{ margin: 0 }}>
        {Math.round(weatherData.current.temp_c)}°C, {weatherData.current.condition.text}
      </p>
      <small style={{ color: '#555' }}>
        Humidity: {weatherData.current.humidity}%, Wind: {Math.round(weatherData.current.wind_kph)} km/h
      </small>
    </div>
  </div>
) : (
  <p>No weather data available.</p>
)}


        </div>
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
            padding: '0.5rem 0.5rem',
            border: 'none',
            maxWidth: '150px',
            borderRadius: '5px'
          }}
        >
          Delete Trip
        </button>
        <div className="tab-content">
          {activeTab === 'final' && (loading ? <p>Loading itinerary...</p> : <ReactMarkdown>{finalItinerary}</ReactMarkdown>)}

{activeTab === 'travelers' && (
  <div className="travelers-tab">
    <h5>Travelers</h5>
    {travelers.length === 0 ? <p>No travelers invited yet.</p> : (
      <ul>
        {
  Array.from(new Map(travelers.map(t => [t.inviteSendTo, t])).values()).map((t, i) => (
    <li key={i}>
      <strong>{t.inviteSendTo}</strong> —{" "}
      <span className={`badge ${t.inviteStatus?.toLowerCase() || 'pending'}`}>
        {t.inviteStatus || "pending"}
      </span>
    </li>
  ))
}

      </ul>
    )}
    <div style={{ marginTop: "1rem" }} className="invite-form">
      <input
        type="email"
        placeholder="Invite user by email"
        value={inviteEmail}
        onChange={(e) => setInviteEmail(e.target.value)}
      />
      <button onClick={handleInvite}>Invite</button>
    </div>
  </div>
)}

          {activeTab === 'sightseeing' && (
  <div className="sightseeing-tab">
    {Object.entries(autoSightseeing).map(([city, sights]) => (
      <div key={city} style={{ marginBottom: '2rem' }}>
        <h4>{city}</h4>
        {sights.length > 0 ? (
          <div className="sightseeing-grid">
            {sights.map((sight, i) => (
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
                  <h6>{sight.name}</h6>
                  <p style={{ color: '#666' }}>{sight.ufiDetails?.bCityName || 'Unknown City'}</p>
                  <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>{sight.shortDescription || 'No description available.'}</p>
                  <p>⭐ {sight.reviewsStats?.combinedNumericStats?.average || 'N/A'} ({sight.reviewsStats?.combinedNumericStats?.total || 0} reviews)</p>
                  <p><strong>₹{sight.representativePrice?.chargeAmount?.toFixed(0) || 'N/A'}</strong></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No attractions found for {city}.</p>
        )}
      </div>
    ))}
  </div>
)}

         {activeTab === 'stays' && (
  <div className="stays-tab">
    {Object.entries(autoStays).map(([city, hotels]) => (
      <div key={city} style={{ marginBottom: '2rem' }}>
        <h5>Stays in {city}</h5>
        {hotels.length > 0 ? (
          <div className="stays-grid">
            {hotels.map((stay, i) => (
              <div className="stay-card" key={i}>
                <div className="stay-img">
                  <img
                    src={stay.cardPhotos?.[0]?.sizes?.urlTemplate
                      ?.replace('{width}', '300')
                      ?.replace('{height}', '200')}
                    alt={stay.title}
                    loading="lazy"
                  />
                </div>
                <div className="stay-details">
                  <h6>{stay.title}</h6>
                  <p>{stay.primaryInfo}</p>
                  <p>{stay.secondaryInfo}</p>
                  <p>⭐ {stay.bubbleRating?.rating || 'N/A'} ({stay.bubbleRating?.count || '0'} reviews)</p>
                  <p>{stay.priceForDisplay || 'No price info'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No stays found for {city}.</p>
        )}
      </div>
    ))}
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
