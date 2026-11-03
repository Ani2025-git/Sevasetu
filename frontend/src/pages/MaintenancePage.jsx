import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, Clock, Mail, ShieldAlert, Globe, ArrowRight, Lock } from 'lucide-react';
import { useWebsiteStatus } from '../context/WebsiteStatusContext';

const MaintenancePage = () => {
  const { language, setLanguage } = useLanguage();
  const { maintenanceData } = useWebsiteStatus();
  const [timeLeft, setTimeLeft] = useState('');

  const currentLang = language || 'en';

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  // Select multilingual title
  const getTitle = () => {
    if (currentLang === 'bn' && maintenanceData.maintenance_title_bn) {
      return maintenanceData.maintenance_title_bn;
    }
    if (currentLang === 'hi' && maintenanceData.maintenance_title_hi) {
      return maintenanceData.maintenance_title_hi;
    }
    return maintenanceData.maintenance_title_en || "We'll Be Back Soon";
  };

  // Select multilingual message
  const getMessage = () => {
    if (currentLang === 'bn' && maintenanceData.maintenance_message_bn) {
      return maintenanceData.maintenance_message_bn;
    }
    if (currentLang === 'hi' && maintenanceData.maintenance_message_hi) {
      return maintenanceData.maintenance_message_hi;
    }
    return (
      maintenanceData.maintenance_message_en ||
      'Seva Setu is temporarily unavailable while we carry out scheduled system maintenance. Please visit again soon.'
    );
  };

  // Live countdown to estimated reopening time if configured
  useEffect(() => {
    if (!maintenanceData.estimated_reopening_at) {
      setTimeLeft('');
      return;
    }

    const targetDate = new Date(maintenanceData.estimated_reopening_at).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft('Scheduled reopening is now underway');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [maintenanceData.estimated_reopening_at]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      {/* Top Bar: Brand Logo & Language Switcher */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <img
            src="/assets/brand/seva-setu-logo.png"
            alt="Seva Setu"
            className="h-10 sm:h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = document.getElementById('maint-logo-fallback');
              if (fb) fb.style.display = 'flex';
            }}
          />
          <div id="maint-logo-fallback" className="hidden items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#173B72] text-white flex items-center justify-center font-black text-sm">
              SS
            </div>
            <span className="text-lg font-bold text-[#173B72] tracking-tight">Seva Setu</span>
          </div>
        </div>

        {/* Compact Language Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-xs text-xs font-semibold">
          <button
            onClick={() => changeLanguage('bn')}
            className={`px-2.5 py-1 rounded transition-colors ${
              currentLang === 'bn' ? 'bg-[#173B72] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-2.5 py-1 rounded transition-colors ${
              currentLang === 'en' ? 'bg-[#173B72] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className={`px-2.5 py-1 rounded transition-colors ${
              currentLang === 'hi' ? 'bg-[#173B72] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </header>

      {/* Main Maintenance Card */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Subtle top saffron accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#173B72] via-[#2878C8] to-[#F39A32]" />

          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-6 relative shadow-inner">
            <div className="absolute inset-0 rounded-2xl bg-amber-400 opacity-20 animate-ping" />
            <Wrench className="w-10 h-10 relative z-10" />
          </div>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Scheduled Maintenance</span>
          </div>

          {/* Multilingual Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#173B72] tracking-tight mb-4">
            {getTitle()}
          </h1>

          {/* Multilingual Message */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto mb-8">
            {getMessage()}
          </p>

          {/* Estimated Reopening Card if set */}
          {maintenanceData.estimated_reopening_at && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 max-w-md mx-auto mb-8 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#2878C8] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estimated Reopening
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(maintenanceData.estimated_reopening_at).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}{' '}
                    IST
                  </p>
                </div>
              </div>
              {timeLeft && (
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Remaining Time:</span>
                  <span className="font-mono font-bold text-[#173B72]">{timeLeft}</span>
                </div>
              )}
            </div>
          )}

          {/* Contact Support info */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Urgent inquiries:</span>
            <a
              href={`mailto:${maintenanceData.support_contact_email || 'support@sevasetu.org'}`}
              className="font-semibold text-[#2878C8] hover:underline"
            >
              {maintenanceData.support_contact_email || 'support@sevasetu.org'}
            </a>
          </div>
        </div>
      </main>

      {/* Footer: Disclaimer and Discrete Admin Login */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          Seva Setu is an independent citizen assistance platform for West Bengal.
        </p>

        {/* Discrete Admin Link so Admins can log in and turn the site back ON */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 font-medium transition-colors text-xs px-2.5 py-1 rounded border border-transparent hover:border-slate-300"
        >
          <Lock className="w-3 h-3" />
          <span>Admin Portal</span>
        </Link>
      </footer>
    </div>
  );
};

export default MaintenancePage;
