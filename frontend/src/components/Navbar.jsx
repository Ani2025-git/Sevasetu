import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Menu, 
  X, 
  LogOut, 
  PlusCircle,
  HelpCircle,
  Activity
} from 'lucide-react';

const Navbar = ({ onOpenObservationModal }) => {
  const { user, isAuthenticated, isAdmin, isObserver, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'text-blue-700 bg-blue-50 font-semibold'
        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Disclaimer Notification Bar */}
      <div className="bg-navy-900 text-slate-200 text-xs px-4 py-1.5 text-center flex items-center justify-center gap-2">
        <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          Independent Pilot
        </span>
        <span className="hidden sm:inline">
          Demonstration project for Bangla Sahayata Kendra (BSK) queue awareness.
        </span>
        <span className="text-slate-300">
          Not affiliated with the Government of West Bengal.
        </span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-blue-800 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-navy-900">Seva</span>
              <span className="text-xl font-bold tracking-tight text-blue-600">Queue</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                Pilot
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">Know Before You Visit</p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/centre" className={navLinkClass}>
            <Building2 className="w-4 h-4" />
            Centre Info
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            <FileText className="w-4 h-4" />
            Services
          </NavLink>
          <NavLink to="/queue" className={navLinkClass}>
            <Clock className="w-4 h-4" />
            Queue Status
          </NavLink>
        </div>

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenObservationModal && (
            <button
              onClick={onOpenObservationModal}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Observation
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-semibold px-3 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}
              {isObserver && !isAdmin && (
                <Link
                  to="/observer"
                  className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Observer Portal
                </Link>
              )}
              <div className="text-right">
                <p className="text-xs font-medium text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 transition-colors shadow-sm"
            >
              Staff Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenObservationModal && (
            <button
              onClick={onOpenObservationModal}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/centre"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Building2 className="w-4 h-4" />
            Centre Info
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <FileText className="w-4 h-4" />
            Services
          </NavLink>
          <NavLink
            to="/queue"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Clock className="w-4 h-4" />
            Queue Status
          </NavLink>

          <div className="pt-3 mt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-600">
                  Signed in as <span className="font-semibold text-slate-800">{user?.name}</span> ({user?.role})
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-sm font-semibold px-4 py-2 rounded-lg bg-navy-900 text-white"
                  >
                    Go to Admin Panel
                  </Link>
                )}
                {isObserver && !isAdmin && (
                  <Link
                    to="/observer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-sm font-semibold px-4 py-2 rounded-lg bg-blue-700 text-white"
                  >
                    Go to Observer Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-sm font-medium px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold px-4 py-2 rounded-lg bg-navy-900 text-white"
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

