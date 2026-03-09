import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';

// Pages
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Scan from './pages/Scan.jsx';
import History from './pages/History.jsx';
import WeatherRisk from './pages/WeatherRisk.jsx';
import Encyclopedia from './pages/Encyclopedia.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Settings from './pages/Settings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminKnowledge from './pages/AdminKnowledge.jsx';
import AdminUsers from './pages/AdminUsers.jsx';

// Guard for authenticated routes
function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-agri-dark flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }
  return token ? children : <Navigate to="/login" replace />;
}

// Guard for admin routes
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected User Routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<Scan />} />
          <Route path="history" element={<History />} />
          <Route path="weather" element={<WeatherRisk />} />
          <Route path="encyclopedia" element={<Encyclopedia />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="settings" element={<Settings />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/knowledge" element={<AdminRoute><AdminKnowledge /></AdminRoute>} />
          <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
