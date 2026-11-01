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
  Bookmark, 
  User, 
  ArrowRight, 
  Search,
  ExternalLink,
  HelpCircle,
  Sparkles
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
    `text-xs lg:text-[13px] font-semibold transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'text-digital font-bold bg-digital-50 border-b-2 border-digital'
        : 'text-slate-700 hover:text-navy hover:bg-slate-100/80'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs transition-all">
      {/* Digital India Tricolor Hairline Accent */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-saffron" />
        <div className="h-full flex-1 bg-white border-y border-slate-200" />
        <div className="h-full flex-1 bg-indiaGreen" />
      </div>

      {/* Top Citizen Utility & Transparency Strip */}
      <div className="bg-navy text-slate-200 text-[11px] px-4 py-1.5 border-b border-navy-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-saffron text-navy font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              Citizen Initiative
            </span>
            <span className="hidden sm:inline font-medium text-slate-200">
              West Bengal Citizen Services Guide • Not officially affiliated with Government of WB
            </span>
            <span className="sm:hidden text-slate-300">WB Public Service Guide</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="hidden md:inline text-saffron-200 font-medium">
              আপনার সরকারি পরিষেবা, সহজ সমাধান
            </span>
            <Link to="/disclaimer" className="text-slate-300 hover:text-white transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white shadow-sm border border-navy-700 group-hover:scale-105 transition-transform">
            {/* Bridge / Citizen Connectivity Icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-saffron">
              <path d="M4 19V9a8 8 0 0 1 16 0v10" />
              <path d="M4 14h16" />
              <path d="M12 9v10" />
              <circle cx="12" cy="5" r="1.5" fill="#16865B" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl font-black text-navy tracking-tight font-sans">Seva</span>
              <span className="text-xl font-black text-digital tracking-tight font-sans">Setu</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-digital-50 text-digital border border-digital-200 px-1.5 py-0.5 rounded">
                WB
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium tracking-tight mt-1">
              Your Government Services, Made Simple.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            <FileText className="w-4 h-4 text-digital" />
            <span>Certificate Directory</span>
          </NavLink>
          <NavLink to="/centre" className={navLinkClass}>
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Bangla Sahayata Kendra</span>
          </NavLink>
          <NavLink to="/queue" className={navLinkClass}>
            <Clock className="w-4 h-4 text-saffron" />
            <span>Queue Status</span>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-saffron-100 text-saffron-800 px-1.5 py-0.5 rounded-full ml-1">
              Coming Soon
            </span>
          </NavLink>
          <NavLink to="/disclaimer" className={navLinkClass}>
            About & Disclaimer
          </NavLink>
        </div>

        {/* Right Section: Auth & Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-bold px-3 py-2 rounded-lg bg-navy text-white hover:bg-navy-900 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-saffron" />
                  Admin
                </Link>
              )}
              {isObserver && !isAdmin && (
                <Link
                  to="/observer"
                  className="text-xs font-bold px-3 py-2 rounded-lg bg-digital text-white hover:bg-digital-600 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Observer
                </Link>
              )}
              {!isAdmin && !isObserver && (
                <Link
                  to="/dashboard"
                  className="text-xs font-bold px-3 py-2 rounded-lg bg-digital-50 text-digital border border-digital-200 hover:bg-digital-100 transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-digital" />
                  Dashboard
                </Link>
              )}

              {/* Citizen User Badge */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-navy text-saffron flex items-center justify-center font-bold text-xs shadow-xs border border-navy-700">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'C')}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-navy leading-tight group-hover:text-digital truncate max-w-[120px]">
                    {user?.full_name || user?.name || 'Citizen'}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    {user?.role || 'Citizen'}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold px-3.5 py-2 text-navy hover:text-digital hover:bg-slate-100 rounded-lg transition-colors"
              >
                Citizen Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 rounded-lg bg-digital hover:bg-digital-600 text-white transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-navy hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fade-in">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <FileText className="w-4 h-4 text-digital" />
            Certificate Directory
          </NavLink>
          <NavLink
            to="/centre"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            Bangla Sahayata Kendra
          </NavLink>
          <NavLink
            to="/queue"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Clock className="w-4 h-4 text-saffron" />
            <span>Queue Status (Coming Soon)</span>
          </NavLink>
          <NavLink
            to="/disclaimer"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            About & Disclaimer
          </NavLink>

          <div className="pt-3 mt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1.5 text-xs text-slate-700 bg-slate-50 rounded-lg">
                  Signed in as <strong className="text-navy">{user?.full_name || user?.name}</strong> ({user?.role || 'Citizen'})
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-bold px-3.5 py-2.5 rounded-lg bg-navy text-white"
                  >
                    Admin Portal
                  </Link>
                )}
                {isObserver && !isAdmin && (
                  <Link
                    to="/observer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-bold px-3.5 py-2.5 rounded-lg bg-digital text-white"
                  >
                    Observer Portal
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-bold px-3.5 py-2.5 rounded-lg bg-digital-50 text-digital border border-digital-200"
                >
                  My Citizen Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-xs font-semibold px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-bold py-2.5 px-3 rounded-lg border border-slate-300 text-navy hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-bold py-2.5 px-3 rounded-lg bg-digital text-white hover:bg-digital-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
