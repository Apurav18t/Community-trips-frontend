import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import toast styles

import Signup from './Signup';
import Signin from './Signin';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import TripForm from './TripForm';
import TripDetails from './components/TripDetails';
<<<<<<< HEAD
import VerifyUser from './Verifyuser'; // ✅ NEW
=======
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f

import Sidebar from './components/Sidebar';
import TopNavbar from './components/topnavbar';
import MainDashboard from './MainDashboard';
import ExplorePage from './ExplorePage';
import NotificationsPage from './NotificationsPage';
import ProfileSettings from './ProfileSettings';
import TripsPage from './components/TripsPage';
import Home from './home';
import TripVibe from './TripVibe';
import ItineraryPage from './ItineraryPage'; // ⭐ itinerary page

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
<<<<<<< HEAD
       <Route path="/verifyUser" element={<VerifyUser />} /> {/* ✅ New OTP verify route */}
=======
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f

        <Route path="/create-trip" element={<TripForm />} />
        <Route path="/tripvibe" element={<TripVibe />} />

        {/* Trip details */}
        <Route path="/trip/:tripId" element={<AppLayout><TripDetails /></AppLayout>} />

        {/* Profile settings */}
        <Route path="/account-settings" element={<AppLayout><ProfileSettings /></AppLayout>} />

        {/* ⭐ Itinerary Page with dynamic tripId */}
        <Route path="/trip/itinerary/:tripId" element={<AppLayout><ItineraryPage /></AppLayout>} />

        {/* ✅ ALSO support email invite link pattern */}
        <Route path="/trips/:tripId" element={<AppLayout><ItineraryPage /></AppLayout>} />

        {/* Main dashboard & app pages */}
        <Route path="/dashboard" element={<AppLayout><MainDashboard /></AppLayout>} />
        <Route path="/explore" element={<AppLayout><ExplorePage /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />

        {/* Trips pages */}
        <Route path="/trips/current" element={<AppLayout><TripsPage type="current" /></AppLayout>} />
        <Route path="/trips/upcoming" element={<AppLayout><TripsPage type="upcoming" /></AppLayout>} />
        <Route path="/trips/past" element={<AppLayout><TripsPage type="past" /></AppLayout>} />
        <Route path="/trips/all" element={<AppLayout><TripsPage type="all" /></AppLayout>} />

        {/* Fallback: show main dashboard */}
        <Route path="*" element={<AppLayout><MainDashboard /></AppLayout>} />
      </Routes>

      {/* ✅ Global toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

// Layout for sidebar + top navbar
function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopNavbar />
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
