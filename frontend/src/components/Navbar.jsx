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
  Compass,
  Sparkles,
  Search,
  ExternalLink
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
    `text-xs lg:text-[13px] font-semibold transition-all duration-150 px-3.5 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-blue-700 bg-blue-50/90 font-bold shadow-xs'
        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Civic Utility & Disclaimer Bar */}
      <div className="bg-navy-950 text-slate-300 text-[11px] px-4 py-1.5 border-b border-navy-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Independent Civic Platform
            </span>
            <span className="hidden md:inline text-slate-300 font-medium">
              Simplifying West Bengal Government Services & Certificate Requirements
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="hidden sm:inline">West Bengal, India</span>
            <Link to="/disclaimer" className="hover:text-blue-300 transition-colors">
              Independent Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-navy-900 via-blue-800 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform duration-200">
            {/* Bridge / Connection Arch SVG */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
              <path d="M4 19V9a8 8 0 0 1 16 0v10" />
              <path d="M4 14h16" />
              <path d="M12 9v10" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-navy-950 font-sans">Seva</span>
              <span className="text-xl font-black tracking-tight text-blue-600 font-sans">Setu</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md">
                WB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 font-medium tracking-tight">
              Government Services, Made Simpler.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Certificates & Services</span>
          </NavLink>
          <NavLink to="/centre" className={navLinkClass}>
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Find BSK Centre</span>
          </NavLink>
          <NavLink to="/queue" className={navLinkClass}>
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Queue Info</span>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full ml-0.5">
              Soon
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
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-navy-950 text-white hover:bg-navy-900 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Admin
                </Link>
              )}
              {isObserver && !isAdmin && (
                <Link
                  to="/observer"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Observer
                </Link>
              )}
              {!isAdmin && !isObserver && (
                <Link
                  to="/dashboard"
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5 border border-blue-200/60"
                >
                  <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                  My Dashboard
                </Link>
              )}

              {/* Citizen User Badge */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'C')}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 truncate max-w-[120px]">
                    {user?.full_name || user?.name || 'Citizen'}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    {user?.role || 'Citizen'}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold px-3.5 py-2 text-slate-700 hover:text-navy-950 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                <span>Citizen Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl animate-fade-in">
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
            <FileText className="w-4 h-4 text-blue-600" />
            Certificates & Services
          </NavLink>
          <NavLink
            to="/centre"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            Find BSK Centre
          </NavLink>
          <NavLink
            to="/queue"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Queue Info (Coming Soon)</span>
          </NavLink>
          <NavLink
            to="/disclaimer"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            About Us & Disclaimer
          </NavLink>

          <div className="pt-3 mt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1.5 text-xs text-slate-600 bg-slate-50 rounded-xl">
                  Signed in as <strong className="text-slate-800">{user?.full_name || user?.name}</strong> ({user?.role || 'Citizen'})
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-bold px-3.5 py-2.5 rounded-xl bg-navy-950 text-white"
                  >
                    Admin Portal
                  </Link>
                )}
                {isObserver && !isAdmin && (
                  <Link
                    to="/observer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-bold px-3.5 py-2.5 rounded-xl bg-blue-600 text-white"
                  >
                    Observer Portal
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-bold px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700"
                >
                  My Citizen Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-xs font-semibold px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-bold py-2.5 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
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
