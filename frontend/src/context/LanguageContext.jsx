import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'bn', label: 'বাংলা', short: 'বাং', name: 'Bengali' },
  { code: 'en', label: 'English', short: 'EN', name: 'English' },
  { code: 'hi', label: 'हिन्दी', short: 'हि', name: 'Hindi' },
];

const TRANSLATIONS = {
  home: { en: 'Home', bn: 'হোম', hi: 'होम' },
  services: { en: 'Services', bn: 'পরিষেবাসমূহ', hi: 'सेवाएं' },
  schemes: { en: 'Schemes', bn: 'প্রকল্প', hi: 'योजनाएं' },
  centres: { en: 'BSK Centres', bn: 'বিএসকে কেন্দ্র', hi: 'बीएसके केंद्र' },
  about: { en: 'About', bn: 'সম্পর্কে', hi: 'परिचय' },
  login: { en: 'Login', bn: 'লগইন', hi: 'लॉग ইন' },
  register: { en: 'Register', bn: 'নিবন্ধন', hi: 'पंजीकरण' },
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড', hi: 'डैशबोर्ड' },
  citizenDashboard: { en: 'Citizen Dashboard', bn: 'নাগরিক ড্যাশবোর্ড', hi: 'नागरिक डैशबोर्ड' },
  signOut: { en: 'Sign Out', bn: 'লগআউট', hi: 'लॉग आउट' },
  language: { en: 'Language', bn: 'ভাষা', hi: 'भाषा' },
  selectLanguage: { en: 'Select Language', bn: 'ভাষা নির্বাচন করুন', hi: 'भाषा चुनें' },
  navigationMenu: { en: 'Navigation Menu', bn: 'নেভিগেশন মেনু', hi: 'नेविगेशन मेनू' },
  closeMenu: { en: 'Close navigation menu', bn: 'মেনু বন্ধ করুন', hi: 'मेनू बंद करें' },
  openMenu: { en: 'Open navigation menu', bn: 'মেনু খুলুন', hi: 'मेनू खोलें' },
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, defaultText) => defaultText || key,
  languages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('sevasetu_lang') || localStorage.getItem('i18nextLng');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      // Ignore localStorage access restrictions
    }
    return 'en';
  });

  const setLanguage = (code) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) return;
    setLanguageState(code);
    try {
      localStorage.setItem('sevasetu_lang', code);
      localStorage.setItem('i18nextLng', code);
    } catch (e) {
      // Ignore localStorage error
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
    // Dispatch event for any other listeners
    try {
      window.dispatchEvent(new CustomEvent('sevasetu:languagechange', { detail: { language: code } }));
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key, defaultText) => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    if (TRANSLATIONS[key] && TRANSLATIONS[key].en) {
      return TRANSLATIONS[key].en;
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
