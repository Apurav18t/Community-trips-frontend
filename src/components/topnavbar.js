// src/components/TopNavbar.jsx
import React from 'react';
import './topnavbar.css';
import { useNavigate } from 'react-router-dom';

const TopNavbar = () => {
  const navigate = useNavigate();

  const handleNewTripClick = () => {
    navigate('/planner'); // Or open a modal form
  };

  return (
    <div className="top-navbar">
     
      <div className="navbar-right">
        <button className="new-trip-btn"  onClick={() => navigate('/create-trip')}>
          New Trip
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
