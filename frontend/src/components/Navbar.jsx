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
  Sparkles,
  Bookmark,
  User,
  ArrowRight,
  Compass
} from 'lucide-react';

const Navbar = ({ onOpenQueueModal }) => {
  const { user, isAuthenticated, isAdmin, isObserver, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs lg:text-sm font-semibold transition-colors px-3 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-blue-700 bg-blue-50/80 font-bold'
        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Disclaimer Notification Bar */}
      <div className="bg-navy-900 text-slate-200 text-xs px-4 py-1.5 text-center flex items-center justify-center gap-2">
        <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Independent Civic Platform
        </span>
        <span className="hidden sm:inline text-slate-300">
          Simplifying West Bengal Government Services & Certificate Requirements.
        </span>
        <span className="text-slate-400 text-[11px]">
          Not an official government portal.
        </span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Bridge / Connection symbol */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-navy-900 via-blue-800 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all">
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
              <span className="text-xl font-black tracking-tight text-navy-900">Seva</span>
              <span className="text-xl font-black tracking-tight text-blue-600">Setu</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md">
                WB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">Government Services, Made Simpler.</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            <FileText className="w-4 h-4" />
            Government Services
          </NavLink>
          <NavLink to="/services?focus=documents" className={navLinkClass}>
            <Compass className="w-4 h-4" />
            Document Guide
          </NavLink>
          <NavLink to="/centre" className={navLinkClass}>
            <Building2 className="w-4 h-4" />
            Find BSK Centre
          </NavLink>
          <button
            onClick={onOpenQueueModal}
            className="text-xs lg:text-sm font-semibold transition-colors px-3 py-2 rounded-xl flex items-center gap-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100/70"
          >
            <Clock className="w-4 h-4" />
            <span>Queue Info</span>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          </button>
          <NavLink to="/disclaimer" className={navLinkClass}>
            About Us
          </NavLink>
        </div>

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal
                </Link>
              )}
              {isObserver && !isAdmin && (
                <Link
                  to="/observer"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Observer Portal
                </Link>
              )}
              {!isAdmin && !isObserver && (
                <Link
                  to="/dashboard"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  My Checklists
                </Link>
              )}
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">{user?.role || 'Citizen'}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold px-3.5 py-2 text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fadeIn">
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
            <FileText className="w-4 h-4" />
            Government Services
          </NavLink>
          <NavLink
            to="/services?focus=documents"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Compass className="w-4 h-4" />
            Document Guide
          </NavLink>
          <NavLink
            to="/centre"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Building2 className="w-4 h-4" />
            Find BSK Centre
          </NavLink>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQueueModal();
            }}
            className="w-full text-left text-xs font-semibold px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Queue Information</span>
            </div>
            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
              Coming Soon
            </span>
          </button>
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
                <div className="px-3 py-1 text-xs text-slate-600">
                  Signed in as <strong className="text-slate-800">{user?.name}</strong> ({user?.role})
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-navy-900 text-white"
                  >
                    Open Admin Dashboard
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-700 text-white"
                  >
                    Citizen Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-xs font-semibold px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-700 text-white"
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
