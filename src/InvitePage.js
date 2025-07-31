import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './InvitePage.css'; // 👉 You'll create this file


//const API_URL = "http://localhost:6969";
 const API_URL = "https://community-trips-backend.onrender.com";

export default function InvitePage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = `/invite/${inviteId}`;
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    // 🔒 Redirect to signin if no token
    if (!token) {
      navigate(`/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
      return;
    }

    const fetchInvite = async () => {
      try {
        const res = await axios.get(`${API_URL}/trips/inviteDetail?id=${inviteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setInvite(res.data.data);
        } else {
          toast.error("Invalid or expired invite link.");
        }
      } catch (err) {
        toast.error("Failed to load invite.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [inviteId, token, navigate]);

  const handleReply = async (status) => {
    try {
      const res = await axios.put(
        `${API_URL}/trips/replyTheInvite`,
        { inviteId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
  toast.success(`Invite ${status}`);
  if (status === 'accepted') {
    navigate(`/p/trip/${invite.tripId?._id || invite.tripId}`);
  } else {
    navigate('/planner');
  }
} else {
  toast.error(res.data.message || 'Failed to update invite status.');
}

    } catch (err) {
      toast.error("Network error while replying.");
    }
  };

  if (loading) return <div>Loading invite…</div>;
  if (!invite) return <div>Invite not found or expired.</div>;

 return (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-button" onClick={() => navigate('/planner')}>×</button>
      <h2 className="modal-title">Trip to {invite.tripName}</h2>
      <p className="modal-subtitle">
        <strong>{invite.inviteSendBy?.fullName || 'Someone'}</strong> has invited you to join them on their trip.
      </p>
      <div className="modal-actions">
        <button className="btn-decline" onClick={() => handleReply('rejected')}>
          Decline
        </button>
        <button className="btn-accept" onClick={() => handleReply('accepted')}>
          Join Trip
        </button>
      </div>
    </div>
  </div>
);
}