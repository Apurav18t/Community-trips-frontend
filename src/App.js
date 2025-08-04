import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './Signup';
import Signin from './Signin';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import TripForm from './TripForm';
import TripDetails from './components/TripDetails';
import VerifyUser from './Verifyuser';
import InvitePage from './InvitePage';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/topnavbar';
import MainDashboard from './MainDashboard';
import ExplorePage from './ExplorePage';
import NotificationsPage from './NotificationsPage';
import ProfileSettings from './ProfileSettings';
import TripsPage from './components/TripsPage';
import Home from './home';
import TripVibe from './TripVibe';
import ItineraryPage from './ItineraryPage';

import ProtectedRoute from './components/Protectedroutes'; // ✅ Add your ProtectedRoute

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
        <Route path="/verifyUser" element={<VerifyUser />} />

        {/* Public/Invite based pages */}
        <Route path="/invite/:inviteId" element={<InvitePage />} />
        <Route path="/p/trip/:tripId" element={<AppLayout><ItineraryPage /></AppLayout>} />
        <Route path="/trip/:tripId" element={<AppLayout><TripDetails /></AppLayout>} />
        <Route path="/tripvibe" element={<TripVibe />} />

        {/* Protected Routes */}
        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <AppLayout><TripForm /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AppLayout><ProfileSettings /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trip/itinerary/:tripId"
          element={
            <ProtectedRoute>
              <AppLayout><ItineraryPage /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips/:tripId"
          element={
            <ProtectedRoute>
              <AppLayout><ItineraryPage /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout><MainDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <AppLayout><ExplorePage /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AppLayout><NotificationsPage /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips/current"
          element={
            <ProtectedRoute>
              <AppLayout><TripsPage type="current" /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/upcoming"
          element={
            <ProtectedRoute>
              <AppLayout><TripsPage type="upcoming" /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/past"
          element={
            <ProtectedRoute>
              <AppLayout><TripsPage type="past" /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/all"
          element={
            <ProtectedRoute>
              <AppLayout><TripsPage type="all" /></AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback to dashboard */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppLayout><MainDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

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

// App layout with sidebar and top navbar
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
