import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from './Footer';
import Navbar from './Navbar';

function Home() {
  const navigate = useNavigate(); // Initialize navigation hook

  return (
    <div className="App" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '1.6' }}>
      <Navbar />
      <div
        style={{
          backgroundImage: 'url("/travel.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          paddingBottom: '40px'
        }}
      >
        <header style={{ padding: '30px 20px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Community Trips</h1>
          <p style={{ fontSize: '18px' }}>Plan smarter with AI – Your next adventure starts here.</p>
        </header>
        <section style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Welcome, Traveler! 🌍</h2>
          <p>Create your custom trip itinerary with just a few clicks.</p>
          <button
            onClick={() => navigate('/signup')} // Redirect to signup
            style={{
              background: '#2E8B57',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Start Planning
          </button>
        </section>
      </div>
      <section style={{ backgroundColor: '#f8f9fa', padding: '40px 20px' }}>
        <h3 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '30px' }}>Why Use Community Trips?</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          <FeatureCard title="AI-Powered Planning" desc="Get smart itineraries based on your interests, time, and budget." />
          <FeatureCard title="Real-Time Customization" desc="Change destinations, days, or companions on the fly." />
          <FeatureCard title="Community Sharing" desc="Explore and share trips created by other travelers." />
        </div>
      </section>
      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '30px' }}>How It Works</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <StepCard step="1" title="Enter Trip Info" desc="Choose destination, dates, and interests." />
          <StepCard step="2" title="Let AI Generate" desc="We’ll create your itinerary in seconds." />
          <StepCard step="3" title="Explore & Share" desc="Save, tweak, or publish your trip for others." />
        </div>
      </section>
      <Footer />
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div style={{
      background: '#fff',
      padding: '20px',
      width: '280px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <h4 style={{ fontSize: '18px', color: '#2E8B57' }}>{title}</h4>
      <p style={{ fontSize: '14px' }}>{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div style={{
      background: '#fff',
      padding: '20px',
      width: '220px',
      borderRadius: '10px',
      border: '1.5px solid #e0e0e0'
    }}>
      <h4 style={{ fontSize: '16px', color: '#2E8B57' }}>Step {step}: {title}</h4>
      <p style={{ fontSize: '14px' }}>{desc}</p>
    </div>
  );
}

export default Home;
