import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-md ${
      isActive
        ? 'text-[#173B72] font-semibold bg-[#EAF2FC]'
        : 'text-[#263445] hover:text-[#173B72] hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
        {/* Seva Setu Official Logo */}
        <Link to="/" className="flex items-center group py-1">
          <img
            src="/assets/brand/seva-setu-logo.png"
            alt="Seva Setu Logo"
            className="h-10 sm:h-[52px] w-auto object-contain transition-opacity hover:opacity-95"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/centre" className={navLinkClass}>
            BSK Centres
          </NavLink>
          <NavLink to="/disclaimer" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        {/* Right Action: Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-[#173B72] hover:text-[#2878C8] px-2.5 py-1.5 rounded-md hover:bg-[#EAF2FC] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#EAF2FC] text-[#173B72] flex items-center justify-center font-bold text-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'U')}
                </div>
                <span className="truncate max-w-[120px]">{user?.full_name || user?.name || 'Dashboard'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-[#173B72] hover:text-[#2878C8] px-3.5 py-2 rounded-lg transition-colors hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-[#173B72] hover:bg-[#2878C8] text-white transition-colors shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-[#173B72] hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg">
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
            Services
          </NavLink>
          <NavLink
            to="/centre"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            BSK Centres
          </NavLink>
          <NavLink
            to="/disclaimer"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            About
          </NavLink>

          <div className="pt-3 mt-2 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#173B72] hover:bg-slate-50 rounded-md"
                >
                  Citizen Dashboard ({user?.full_name || user?.name || 'Account'})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium py-2 px-3 rounded-lg border border-slate-200 text-[#173B72] hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium py-2 px-3 rounded-lg bg-[#173B72] text-white"
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
