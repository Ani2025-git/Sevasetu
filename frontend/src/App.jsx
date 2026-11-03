import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ObservationModal from './components/ObservationModal';

// Pages
import HomePage from './pages/HomePage';
import CentreDetailsPage from './pages/CentreDetailsPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import QueueStatusPage from './pages/QueueStatusPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/CitizenDashboard';
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

const CitizenRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) {
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
          <Route path="/bsk-centres" element={<Navigate to="/centre" replace />} />
          <Route path="/centres" element={<Navigate to="/centre" replace />} />
          <Route path="/about" element={<Navigate to="/disclaimer" replace />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/schemes/:slug" element={<SchemeDetailsPage />} />
          <Route
            path="/queue"
            element={<QueueStatusPage onOpenObservationModal={() => setIsObservationModalOpen(true)} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <CitizenRoute>
                <CitizenDashboard />
              </CitizenRoute>
            }
          />
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
          { id: 1, name: 'Bangla Sahayata Kendra — Alipore SDO Office', district: 'South 24 Parganas' },
          { id: 2, name: 'Bangla Sahayata Kendra — Salt Lake BDO Office', district: 'North 24 Parganas' },
        ]}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <MainLayout />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
