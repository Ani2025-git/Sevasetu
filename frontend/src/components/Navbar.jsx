import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronDown,
  LayoutDashboard,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

const Navbar = ({ onOpenObservationModal }) => {
  const { user, isAuthenticated, isAdmin, isObserver, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDashboardDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs lg:text-[13px] font-semibold transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'text-saffron font-bold bg-white/10'
        : 'text-slate-100 hover:text-saffron hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 transition-all duration-200">
      {/* Tricolor Accent Hairline */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-saffron" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-indiaGreen" />
      </div>

      {/* Top Citizen Transparency Bar */}
      <div className="bg-navy-950 text-slate-300 text-[11px] px-4 py-1 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-saffron text-navy font-bold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
              Citizen Initiative
            </span>
            <span className="hidden sm:inline font-medium text-slate-300">
              West Bengal Citizen Services Guide • Independent Public Platform
            </span>
            <span className="sm:hidden text-slate-300">WB Public Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="hidden md:inline text-saffron font-medium">
              আপনার সরকারি পরিষেবা, সহজ সমাধান
            </span>
            <Link to="/disclaimer" className="text-slate-300 hover:text-white transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Transparent / Dark Glass Navigation Bar */}
      <nav
        className={`w-full transition-all duration-200 ${
          scrolled || !isHome
            ? 'bg-navy/95 backdrop-blur-md shadow-md border-b border-navy-700 text-white'
            : 'bg-navy/85 backdrop-blur-sm border-b border-white/10 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-saffron">
                <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                <path d="M4 14h16" />
                <path d="M12 9v10" />
                <circle cx="12" cy="5" r="1.5" fill="#16865B" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black text-white tracking-tight font-sans">Seva</span>
                <span className="text-xl font-black text-saffron tracking-tight font-sans">Setu</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/15 text-slate-100 border border-white/20 px-1.5 py-0.5 rounded ml-0.5">
                  WB
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium tracking-tight mt-1">
                A Comprehensive Citizen Service Platform.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/disclaimer" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              <FileText className="w-3.5 h-3.5 text-saffron" />
              <span>Services</span>
            </NavLink>
            <NavLink to="/centre" className={navLinkClass}>
              <Building2 className="w-3.5 h-3.5 text-slate-300" />
              <span>BSK Centres</span>
            </NavLink>
            <NavLink to="/queue" className={navLinkClass}>
              <Clock className="w-3.5 h-3.5 text-saffron" />
              <span>Queue</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-saffron text-navy px-1.5 py-0.2 rounded-full ml-1">
                Soon
              </span>
            </NavLink>

            {/* Dashboard Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                onBlur={() => setTimeout(() => setDashboardDropdownOpen(false), 200)}
                className="text-xs lg:text-[13px] font-semibold text-slate-100 hover:text-saffron hover:bg-white/5 transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-digital-200" />
                <span>Dashboard</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {dashboardDropdownOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white text-navy rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in text-xs">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 transition-colors font-medium text-navy"
                  >
                    <Bookmark className="w-4 h-4 text-digital" />
                    <span>Citizen Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    <FileText className="w-4 h-4 text-saffron" />
                    <span>Saved Checklists</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <Link
                    to="/observer"
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    <UserCheck className="w-4 h-4 text-indiaGreen" />
                    <span>Observer Portal</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    <ShieldCheck className="w-4 h-4 text-navy" />
                    <span>Admin Operations</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Auth & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-white/20">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-saffron text-navy flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'C')}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-white group-hover:text-saffron truncate max-w-[110px]">
                      {user?.full_name || user?.name || 'Citizen'}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-1.5 text-white hover:text-saffron hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-saffron hover:bg-saffron-600 text-navy transition-all shadow-xs flex items-center gap-1"
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
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-navy-700 bg-navy text-white px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-fade-in">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/disclaimer"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <FileText className="w-4 h-4 text-saffron" />
              Services Directory
            </NavLink>
            <NavLink
              to="/centre"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <Building2 className="w-4 h-4 text-slate-300" />
              BSK Centres
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
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <LayoutDashboard className="w-4 h-4 text-digital-200" />
              <span>Citizen Dashboard</span>
            </NavLink>

            <div className="pt-3 mt-3 border-t border-navy-700">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-1.5 text-xs text-slate-300 bg-white/5 rounded-lg">
                    Signed in as <strong className="text-saffron">{user?.full_name || user?.name}</strong>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-bold px-3 py-2 rounded-lg bg-white/10 text-white"
                    >
                      Admin Portal
                    </Link>
                  )}
                  {isObserver && !isAdmin && (
                    <Link
                      to="/observer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-bold px-3 py-2 rounded-lg bg-digital text-white"
                    >
                      Observer Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left text-xs font-semibold px-3 py-2 text-rose-300 hover:bg-white/5 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-xs font-bold py-2.5 px-3 rounded-lg border border-white/20 text-white hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-xs font-bold py-2.5 px-3 rounded-lg bg-saffron text-navy font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
