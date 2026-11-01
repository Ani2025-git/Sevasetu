import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ObservationModal from './components/ObservationModal';

// Pages
import HomePage from './pages/HomePage';
import CentreDetailsPage from './pages/CentreDetailsPage';
import ServicesPage from './pages/ServicesPage';
import QueueStatusPage from './pages/QueueStatusPage';
import LoginPage from './pages/LoginPage';
import ObserverDashboard from './pages/ObserverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DisclaimerPage from './pages/DisclaimerPage';

// Protected Route Helpers
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ObserverRoute = ({ children }) => {
  const { user, loading, isObserver } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || !isObserver) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function MainLayout() {
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar onOpenObservationModal={() => setIsObservationModalOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage onOpenObservationModal={() => setIsObservationModalOpen(true)} />}
          />
          <Route
            path="/centre"
            element={<CentreDetailsPage onOpenObservationModal={() => setIsObservationModalOpen(true)} />}
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route
            path="/queue"
            element={<QueueStatusPage onOpenObservationModal={() => setIsObservationModalOpen(true)} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<DisclaimerPage />} />

          {/* Protected Dashboards */}
          <Route
            path="/observer"
            element={
              <ObserverRoute>
                <ObserverDashboard />
              </ObserverRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Observation Modal */}
      <ObservationModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
        centres={[
          { id: 1, name: 'SevaQueue Pilot Centre — Sample BSK', district: 'South 24 Parganas (Sample)' },
          { id: 2, name: 'Secondary Demonstration Centre — North BSK (Sample)', district: 'North 24 Parganas (Sample)' },
        ]}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;

