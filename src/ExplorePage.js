import React, { useEffect, useState } from 'react';
import './ExplorePage.css';

const dummyData = {
  attractions: [
    {
      name: 'Eiffel Tower',
      image: 'https://source.unsplash.com/featured/?eiffel',
      description: 'An iconic symbol of Paris, France.',
    },
    {
      name: 'Great Wall of China',
      image: 'https://source.unsplash.com/featured/?great-wall',
      description: 'A historic fortification in China.',
    },
  ],
  stays: [
    {
      name: 'Cozy Cottage',
      image: 'https://source.unsplash.com/featured/?cottage',
      description: 'A peaceful countryside retreat.',
    },
    {
      name: 'Luxury Hotel',
      image: 'https://source.unsplash.com/featured/?hotel',
      description: 'Five-star experience in the city.',
    },
  ],
  restaurants: [
    {
      name: 'Sushi Bar',
      image: 'https://source.unsplash.com/featured/?sushi',
      description: 'Fresh sushi and sashimi.',
    },
    {
      name: 'Italian Bistro',
      image: 'https://source.unsplash.com/featured/?italian-food',
      description: 'Authentic Italian pasta and pizza.',
    },
  ],
};

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('attractions');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate async fetch with timeout
    const loadData = () => {
      setTimeout(() => {
        setData(dummyData[activeTab] || []);
      }, 500); // half-second delay to mimic loading
    };

    loadData();
  }, [activeTab]);

  return (
    <div className="explore-page">
      <h2 className="explore-heading">Explore</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('attractions')} className={activeTab === 'attractions' ? 'active' : ''}>Attractions</button>
        <button onClick={() => setActiveTab('stays')} className={activeTab === 'stays' ? 'active' : ''}>Stays</button>
        <button onClick={() => setActiveTab('restaurants')} className={activeTab === 'restaurants' ? 'active' : ''}>Restaurants</button>
      </div>

      <div className="card-grid">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div className="card" key={index}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
