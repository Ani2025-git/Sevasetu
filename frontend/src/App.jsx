import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { WebsiteStatusProvider, useWebsiteStatus } from './context/WebsiteStatusContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';
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
import MaintenancePage from './pages/MaintenancePage';

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
  const { isMaintenanceMode } = useWebsiteStatus();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // If Maintenance Mode is active:
  // 1. Authenticated Admins bypass maintenance mode and see an administrative notification banner.
  // 2. Unauthenticated visitors can only access /login (to allow admins to sign in).
  // 3. All other public requests display the Maintenance Page.
  if (isMaintenanceMode && !isAdmin) {
    if (location.pathname === '/login') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
          <div className="bg-amber-500 text-slate-900 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>MAINTENANCE MODE IS ACTIVE — Admin Authentication Portal</span>
          </div>
          <main className="flex-1 flex items-center justify-center p-4">
            <LoginPage />
          </main>
        </div>
      );
    }
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Floating Admin Bypass Banner when Maintenance Mode is ON */}
      {isMaintenanceMode && isAdmin && (
        <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-4 py-2 text-xs font-bold shadow-md sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              ⚡ MAINTENANCE MODE ACTIVE — Public visitors see the Maintenance Page. You are viewing in Admin Bypass Mode.
            </span>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 px-3 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-[11px] font-bold transition-colors"
          >
            <span>Open Website Control</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

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
      <WebsiteStatusProvider>
        <LanguageProvider>
          <Router>
            <MainLayout />
          </Router>
        </LanguageProvider>
      </WebsiteStatusProvider>
    </AuthProvider>
  );
}

export default App;
