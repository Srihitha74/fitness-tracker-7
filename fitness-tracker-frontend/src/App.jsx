import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import WorkoutHistory from './components/WorkoutHistory';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user is logged in from localStorage on app start
    const userEmail = localStorage.getItem('userEmail');
    const isLoggedInFlag = localStorage.getItem('isLoggedIn');
    return userEmail !== null && isLoggedInFlag === 'true';
  });

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  // Profile wrapper to force remount on navigation
  const ProfileWrapper = () => {
    const location = useLocation();
    return <Profile key={location.pathname + location.search} />;
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileWrapper />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <WorkoutHistory />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
