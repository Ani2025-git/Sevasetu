import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu,
  X,
  LogOut,
  Award,
  Globe,
  ChevronDown,
  Check,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const mobileLangDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target) &&
        mobileLangDropdownRef.current &&
        !mobileLangDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle Escape key to close mobile menu & dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (langDropdownOpen) {
          setLangDropdownOpen(false);
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [langDropdownOpen, mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const desktopNavLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-[#173B72] font-semibold bg-[#EAF2FC]'
        : 'text-[#263445] hover:text-[#173B72] hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px] ${
      isActive
        ? 'bg-[#EAF2FC] text-[#173B72] shadow-2xs'
        : 'text-slate-700 hover:text-[#173B72] hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 md:h-[72px] flex items-center justify-between gap-2">
        {/* LEFT: Official Logo */}
        <Link
          to="/"
          className="flex items-center group py-1 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2878C8] rounded-md"
          aria-label="Seva Setu Home"
        >
          <img
            src="/assets/brand/seva-setu-logo.png"
            alt="Seva Setu Logo"
            className="h-8 sm:h-10 md:h-[50px] w-auto max-w-[130px] sm:max-w-[160px] md:max-w-none object-contain transition-opacity group-hover:opacity-95"
          />
        </Link>

        {/* CENTER: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label={t('navigationMenu', 'Main Navigation')}
        >
          <NavLink to="/" className={desktopNavLinkClass} end>
            {t('home', 'Home')}
          </NavLink>
          <NavLink to="/services" className={desktopNavLinkClass}>
            {t('services', 'Services')}
          </NavLink>
          <NavLink to="/schemes" className={desktopNavLinkClass}>
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#F39A32] shrink-0" />
              <span>{t('schemes', 'Schemes')}</span>
            </span>
          </NavLink>
          <NavLink to="/centre" className={desktopNavLinkClass}>
            {t('centres', 'BSK Centres')}
          </NavLink>
          <NavLink to="/disclaimer" className={desktopNavLinkClass}>
            {t('about', 'About')}
          </NavLink>
        </nav>

        {/* RIGHT (DESKTOP): Language Switcher & Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Desktop Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#173B72] bg-[#F5F7FA] hover:bg-[#EAF2FC] border border-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2878C8]"
              aria-expanded={langDropdownOpen}
              aria-haspopup="listbox"
              aria-label={t('selectLanguage', 'Select Language')}
            >
              <Globe className="w-3.5 h-3.5 text-[#2878C8]" />
              <span className="font-medium">{currentLangObj.label}</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {langDropdownOpen && (
              <div
                role="listbox"
                aria-label={t('language', 'Language')}
                className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-[#EAF2FC] text-[#173B72] font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#173B72]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({lang.short})</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#2878C8]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-xs font-semibold text-[#173B72] hover:text-[#2878C8] px-2.5 py-1.5 rounded-lg hover:bg-[#EAF2FC] transition-colors border border-transparent hover:border-blue-100"
              >
                <div className="w-6 h-6 rounded-full bg-[#173B72] text-white flex items-center justify-center font-bold text-[11px]">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.name?.charAt(0) || 'U'}
                </div>
                <span className="truncate max-w-[110px]">
                  {user?.full_name || user?.name || t('dashboard', 'Dashboard')}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title={t('signOut', 'Sign Out')}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                aria-label={t('signOut', 'Sign Out')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="text-xs font-semibold text-[#173B72] hover:text-[#2878C8] px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-100"
              >
                {t('login', 'Login')}
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#173B72] hover:bg-[#2878C8] text-white transition-colors shadow-2xs"
              >
                {t('register', 'Register')}
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT (MOBILE): Compact Language Selector & Hamburger */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          {/* Mobile Header Compact Language Toggle */}
          <div className="relative" ref={mobileLangDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-9 px-2 sm:px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#173B72] text-xs font-bold flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2878C8]"
              aria-expanded={langDropdownOpen}
              aria-haspopup="listbox"
              aria-label={t('selectLanguage', 'Select Language')}
            >
              <Globe className="w-3.5 h-3.5 text-[#2878C8] shrink-0" />
              <span className="text-[11px] font-semibold">{currentLangObj.short}</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Mobile Dropdown */}
            {langDropdownOpen && (
              <div
                role="listbox"
                aria-label={t('language', 'Language')}
                className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-[#EAF2FC] text-[#173B72] font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#173B72]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#2878C8]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setLangDropdownOpen(false);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-700 hover:text-[#173B72] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2878C8]"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? t('closeMenu', 'Close navigation menu') : t('openMenu', 'Open navigation menu')}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-14 sm:top-16 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MOBILE DRAWER NAVIGATION PANEL */}
      <div
        id="mobile-navigation-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('navigationMenu', 'Mobile Navigation Menu')}
        className={`fixed top-14 sm:top-16 left-0 right-0 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto bg-white border-b border-slate-200 shadow-xl z-50 md:hidden transition-all duration-300 ease-out transform ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
          {/* Language Selector Row inside Drawer */}
          <div className="bg-[#F5F7FA] p-1.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between px-2 pb-1.5 pt-0.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#2878C8]" />
                <span>{t('language', 'Language')}</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center min-h-[36px] flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#173B72] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="space-y-1">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass} end>
              <span>{t('home', 'Home')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>

            <NavLink to="/services" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <span>{t('services', 'Services')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>

            <NavLink to="/schemes" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F39A32] shrink-0" />
                <span>{t('schemes', 'Schemes')}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>

            <NavLink to="/centre" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <span>{t('centres', 'BSK Centres')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>

            <NavLink to="/disclaimer" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <span>{t('about', 'About')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>
          </nav>

          {/* Authentication Section in Drawer */}
          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#EAF2FC] hover:bg-blue-100/70 text-[#173B72] rounded-xl text-sm font-bold min-h-[48px] transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-full bg-[#173B72] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="truncate">
                      {user?.full_name || user?.name || t('citizenDashboard', 'Citizen Dashboard')}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#173B72] shrink-0" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 rounded-xl min-h-[44px] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('signOut', 'Sign Out')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-sm font-bold py-3 px-3 rounded-xl border border-slate-300 text-[#173B72] hover:bg-slate-50 transition-colors min-h-[48px]"
                >
                  {t('login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-sm font-bold py-3 px-3 rounded-xl bg-[#173B72] hover:bg-[#2878C8] text-white transition-colors shadow-2xs min-h-[48px]"
                >
                  {t('register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
