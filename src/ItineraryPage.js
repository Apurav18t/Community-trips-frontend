// ✅ Imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ItineraryPage.css';

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

  const access_token = localStorage.getItem('access_token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${access_token}`
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
        const tripRes = await axios.get(`http://localhost:6969/trips/detail?id=${tripId}`, authHeader);
        const tripData = tripRes.data?.trip || tripRes.data?.data;

        if (tripData?.itineraryData) {
          // ✅ Use existing itinerary
          setInitialItinerary(tripData.itineraryData);
          setFinalItinerary(tripData.itineraryData);
        } else {
          // 🚨 Generate if not found
          const genRes = await axios.post('http://localhost:6969/itinerary/generate', { tripId }, authHeader);
          setInitialItinerary(genRes.data.data);
          setFinalItinerary(genRes.data.data);

          // ✅ Save it
          await axios.put('http://localhost:6969/itinerary/save', {
            tripId,
            itineraryData: genRes.data.data
          }, authHeader);
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
        const res = await axios.get(`http://localhost:6969/trips/invites?tripId=${tripId}`, authHeader);
        if (res.data.success) {
          setTravelers(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching travelers:", err);
      }
    };

    fetchTripDetails();
    fetchTravelers();
    window.scrollTo(0, 0);
  }, [tripId, navigate]);

  const handleReGenerate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:6969/itinerary/re-generate',
        { tripId, prompt: userPrompt },
        authHeader
      );

      setFinalItinerary(res.data.data);
      setUserPrompt('');

      // ✅ Save regenerated itinerary
      await axios.put('http://localhost:6969/itinerary/save', {
        tripId,
        itineraryData: res.data.data
      }, authHeader);

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
      const res = await axios.post('http://localhost:6969/trips/inviteUser', {
        email: inviteEmail,
        tripId,
      }, authHeader);

      if (res.data.success) {
        toast.success("Invitation sent!");
        setInviteEmail('');
        const updated = await axios.get(`http://localhost:6969/trips/invites?tripId=${tripId}`, authHeader);
        if (updated.data.success) {
          setTravelers(updated.data.data);
        }
      } else {
        toast.error(res.data.message || "Failed to send invite.");
      }
    } catch (err) {
      console.error("Error sending invite:", err);
      toast.error("Something went wrong while sending invite.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="itinerary-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="left-panel">
        <div className="itinerary-scroll-content">
          <h3>
            Hola <span style={{ color: '#6A5ACD' }}>{userName}</span> 👋, today we are working on your trip: <span style={{ color: '#6A5ACD' }}>{tripName}</span>
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

        <div className="tab-content">
          {activeTab === 'final' && (loading ? <p>Loading itinerary...</p> : <ReactMarkdown>{finalItinerary}</ReactMarkdown>)}
          {activeTab === 'travelers' && (
            <div className="travelers-tab">
              <h5>Travelers Who Have Joined:</h5>
              <ul>
                {travelers.filter(t => t.invitedAccepted === 'accepted').map((t, i) => (
                  <li key={i}><strong>{t.inviteSendTo}</strong></li>
                ))}
                {travelers.filter(t => t.invitedAccepted === 'pending').length > 0 && <p>Some invites are still pending...</p>}
              </ul>
              <div className="invite-form" style={{ marginTop: "1rem" }}>
                <input type="email" placeholder="Invite user by email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                <button onClick={handleInvite}>Invite</button>
              </div>
            </div>
          )}
          {activeTab === 'sightseeing' && <ul>{['Masai Mara Safari', 'Nairobi Museum', 'Local Markets'].map((s, i) => <li key={i}>{s}</li>)}</ul>}
          {activeTab === 'stays' && <ul>{['Fairmont Hotel', 'Serena Safari Lodge'].map((s, i) => <li key={i}>{s}</li>)}</ul>}
          {activeTab === 'tips' && <ul>{['Carry sunscreen', 'Local currency cash', 'Respect local customs'].map((t, i) => <li key={i}>{t}</li>)}</ul>}
        </div>
      </div>
    </div>
  );
}
