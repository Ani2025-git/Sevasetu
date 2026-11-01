import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Clock, 
  FileText, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  MapPin, 
  Users, 
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Layers,
  Sparkles,
  Compass,
  CheckSquare,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Landmark,
  FileCheck,
  Award,
  Zap,
  IndianRupee,
  Bell,
  Smartphone,
  Eye,
  Check,
  ArrowUpRight,
  Briefcase,
  Wrench,
  Gift
} from 'lucide-react';
import { publicService } from '../services/api';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const HomePage = ({ onOpenObservationModal }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [centres, setCentres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [districts, setDistricts] = useState(['All']);
  const [loading, setLoading] = useState(true);

  // 3. What's New Ticker State
  const announcements = [
    { id: 1, text: 'WB e-District 2.0 digital verification guidelines updated for 2026 applications.', link: '/services' },
    { id: 2, text: 'Bangla Sahayata Kendra (BSK) operators assist citizens free of charge across all districts.', link: '/centre' },
    { id: 3, text: 'Oasis Caste Certificate portal checklist: Blood relation proof and Gram Panchayat certificate verified.', link: '/services' },
    { id: 4, text: 'Janma-Mrityu Tathya civil registration portal guidelines updated for hospital & home births.', link: '/services' },
  ];
  const [currentTickerIdx, setCurrentTickerIdx] = useState(0);

  // 5. Service Category Tabs State
  const [selectedTab, setSelectedTab] = useState('Citizen Services');
  const [leftSearchQuery, setLeftSearchQuery] = useState('');

  // Queue notify state
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDistrict, setNotifyDistrict] = useState('Kolkata');
  const [notifyDone, setNotifyDone] = useState(false);

  // External Redirect Modal State
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    url: '',
    serviceName: '',
    portalName: 'Official West Bengal Government Portal',
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [servicesRes, centresRes] = await Promise.all([
          publicService.getAllServices(),
          publicService.getCentres()
        ]);
        if (servicesRes.data.success) {
          setServices(servicesRes.data.services);
        }
        if (centresRes.data.success) {
          setCentres(centresRes.data.centres);
          if (centresRes.data.districts) {
            setDistricts(centresRes.data.districts);
          }
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Auto-rotate What's New Ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTickerIdx((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const prevTicker = () => {
    setCurrentTickerIdx((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const nextTicker = () => {
    setCurrentTickerIdx((prev) => (prev + 1) % announcements.length);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyDone(true);
  };

  const handleApplyClick = (service, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!service.online_apply_url) return;
    setRedirectModal({
      isOpen: true,
      url: service.online_apply_url,
      serviceName: service.name,
      portalName: service.department || 'West Bengal Official Portal',
    });
  };

  const filteredCentres = centres.filter(c => {
    return selectedDistrict === 'All' || c.district === selectedDistrict;
  });

  // Real statistics derived from backend records
  const totalServicesCount = services.length;
  const certificateServicesCount = services.filter(s => 
    s.name.toLowerCase().includes('certificate') || 
    (s.category && s.category.toLowerCase().includes('certificate'))
  ).length;
  const totalCentresCount = centres.length;
  const updatedGuidesCount = services.filter(s => s.required_documents && s.required_documents.length > 0).length;

  // Filter services by category tab
  const getTabServices = () => {
    switch (selectedTab) {
      case 'Citizen Services':
        return services.filter(s => 
          s.name.toLowerCase().includes('income') || 
          s.name.toLowerCase().includes('caste') || 
          s.name.toLowerCase().includes('residence') ||
          s.name.toLowerCase().includes('birth') ||
          s.name.toLowerCase().includes('death')
        );
      case 'Business Services':
        return services.filter(s => 
          s.category?.toLowerCase().includes('revenue') || 
          s.name.toLowerCase().includes('income') ||
          s.name.toLowerCase().includes('residence')
        );
      case 'Utility Services':
        return services.filter(s => 
          s.name.toLowerCase().includes('ration') || 
          s.category?.toLowerCase().includes('food')
        );
      case 'Government Schemes':
        return services.filter(s => 
          s.name.toLowerCase().includes('caste') || 
          s.name.toLowerCase().includes('ration')
        );
      default:
        return services;
    }
  };

  const tabServices = getTabServices().length > 0 ? getTabServices() : services;

  // Searchable services in Left Side of Section 6
  const leftServices = services.filter(s => {
    if (!leftSearchQuery.trim()) return true;
    const q = leftSearchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.department && s.department.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-16 pb-16">
      {/* 2. FULL-WIDTH PHOTOGRAPHIC HERO SECTION */}
      <section className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-2 sm:-mt-3">
        {/* Photographic Background with High-Quality Civic Architecture */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=80')`
          }}
        />

        {/* Dark Transparent Overlay for Crisp Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-900/85 to-navy-950/95 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pb-28 space-y-6">
          {/* Civic Micro-Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-saffron" />
            <span>Digital Citizen Services Guide • West Bengal</span>
          </div>

          {/* Exact Required Large Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Welcome to <span className="text-saffron">Seva Setu</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 font-medium tracking-tight">
            Connecting Citizens with Government Services
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            An independent platform to discover public services, verify required document checklists, and navigate official West Bengal portals without intermediaries.
          </p>

          {/* Large Centered Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="relative shadow-lg rounded-xl overflow-hidden bg-white border border-slate-300 focus-within:border-digital transition-all">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Income Certificate, Caste Certificate, Residence Certificate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 sm:pr-36 py-4 bg-white text-navy placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 bg-digital hover:bg-digital-600 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Exact Required Search Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 mt-3.5">
              <span className="text-slate-400 font-medium">Suggestions:</span>
              {[
                { label: 'Income Certificate', query: 'Income' },
                { label: 'Caste Certificate', query: 'Caste' },
                { label: 'Residence Certificate', query: 'Residence' },
                { label: 'Birth Certificate', query: 'Birth' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(`/services?search=${encodeURIComponent(item.query)}`)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white transition-colors border border-white/20 text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S NEW TICKER (Horizontal Announcement Bar) */}
      <section className="-mt-8 relative z-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row items-center justify-between text-xs">
          {/* Label */}
          <div className="bg-saffron text-navy font-black px-4 py-3 flex items-center gap-2 shrink-0 uppercase tracking-wider w-full sm:w-auto justify-center sm:justify-start">
            <Bell className="w-4 h-4" />
            <span>What's New</span>
          </div>

          {/* Rotating Text */}
          <div className="flex-1 px-4 py-2.5 sm:py-0 overflow-hidden flex items-center justify-between w-full">
            <p className="text-slate-700 truncate font-medium">
              {announcements[currentTickerIdx].text}
            </p>
            <Link
              to={announcements[currentTickerIdx].link}
              className="text-digital font-bold hover:underline shrink-0 ml-3 text-[11px]"
            >
              View More
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 px-3 py-2 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-200 shrink-0">
            <button
              onClick={prevTicker}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
              title="Previous Announcement"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 font-mono px-1">
              {currentTickerIdx + 1}/{announcements.length}
            </span>
            <button
              onClick={nextTicker}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
              title="Next Announcement"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION (Real Counts From Backend) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-digital" />
              Available Services
            </div>
            <div className="text-2xl sm:text-3xl font-black text-navy">
              {loading ? '...' : totalServicesCount}
            </div>
            <p className="text-[11px] text-slate-500">Government Services Listed</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-saffron" />
              Certificate Services
            </div>
            <div className="text-2xl sm:text-3xl font-black text-navy">
              {loading ? '...' : certificateServicesCount}
            </div>
            <p className="text-[11px] text-slate-500">Public Certificates Verified</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indiaGreen" />
              BSK Centres
            </div>
            <div className="text-2xl sm:text-3xl font-black text-navy">
              {loading ? '...' : totalCentresCount}
            </div>
            <p className="text-[11px] text-slate-500">Verified Pilot Centres in WB</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-digital" />
              Service Guides
            </div>
            <div className="text-2xl sm:text-3xl font-black text-navy">
              {loading ? '...' : updatedGuidesCount}
            </div>
            <p className="text-[11px] text-slate-500">Document Checklists Ready</p>
          </div>
        </div>
      </section>

      {/* 5. SERVICE CATEGORY TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'Citizen Services', icon: <Users className="w-4 h-4" /> },
              { id: 'Business Services', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'Utility Services', icon: <Wrench className="w-4 h-4" /> },
              { id: 'Government Schemes', icon: <Gift className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.id}</span>
              </button>
            ))}
          </div>

          <Link
            to="/services"
            className="text-xs font-bold text-digital hover:text-navy hidden sm:flex items-center gap-1"
          >
            All Services <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tabbed Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tabServices.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-digital hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-digital-50 text-digital border border-digital-200">
                    {service.category || 'Certificate'}
                  </span>
                  <span className="text-[11px] font-semibold text-indiaGreen bg-indiaGreen-50 px-2 py-0.5 rounded border border-indiaGreen-200">
                    {service.fees || 'Free'}
                  </span>
                </div>

                <Link
                  to={`/services/${service.id}`}
                  className="font-bold text-base text-navy hover:text-digital transition-colors block line-clamp-1"
                >
                  {service.name}
                </Link>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {service.department || 'Government of West Bengal'}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {service.required_documents?.length || 0} Docs Required
                </span>
                <Link
                  to={`/services/${service.id}`}
                  className="font-bold text-digital hover:text-navy flex items-center gap-1"
                >
                  View Guide <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MAIN CONTENT SECTION (Two-Column Reference Layout) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDE: Category Navigation & Searchable Service List */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <FileText className="w-4 h-4 text-digital" />
                  Government Services List
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search or select a public service to view requirements
                </p>
              </div>

              {/* Mini search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter service list..."
                  value={leftSearchQuery}
                  onChange={(e) => setLeftSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-digital bg-surface"
                />
              </div>

              {/* Scrollable list of services */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {leftServices.map((s) => (
                  <Link
                    key={s.id}
                    to={`/services/${s.id}`}
                    className="p-3 rounded-lg border border-slate-200 hover:border-digital hover:bg-digital-50/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-digital shrink-0 group-hover:bg-digital group-hover:text-white transition-colors">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-navy group-hover:text-digital transition-colors truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {s.department || 'West Bengal'}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-digital shrink-0" />
                  </Link>
                ))}
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/services"
                  className="text-xs font-bold text-digital hover:underline"
                >
                  View Complete Public Services Directory →
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE: Reference Inspired Editorial Box */}
            <div className="lg:col-span-7 bg-surface rounded-xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron">
                  Citizen Empowerment
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight leading-tight">
                  Empowering Citizens with Government Services.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Seva Setu</strong> is designed to remove the complexity of dealing with administrative procedures. We empower every citizen of West Bengal with clear documentation checklists, verified timelines, and direct links to official government portals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-digital" />
                    Document Guide
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Pre-verify identity, residence, and income proof to prevent counter rejections.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-saffron" />
                    Online Apply
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Direct safe redirection to official West Bengal portals without intermediaries.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indiaGreen" />
                    BSK Help
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Find nearest Bangla Sahayata Kendra counters for free operator assistance.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-navy hover:bg-navy-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-xs"
                >
                  <span>Explore All Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/centre"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-navy border border-slate-300 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4 text-saffron" />
                  <span>Locate BSK Centres</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7A. HOW SEVA SETU WORKS */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-digital">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              How Seva Setu Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Prepare before you visit to guarantee hassle-free service delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-digital text-white flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-bold text-base text-navy">Search & Select Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search your required certificate (Income, Caste, Residence, Birth) or browse public services by department.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron text-navy font-bold text-base">
                2
              </div>
              <h3 className="font-bold text-base text-navy">Review Document Checklist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tick off identity, address, and income proofs on our interactive checklist. Save your progress on your device.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indiaGreen text-white font-bold text-base">
                3
              </div>
              <h3 className="font-bold text-base text-navy">Apply Directly Online or at BSK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click safely through to official state portals or walk into any Bangla Sahayata Kendra for free operator submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7B. REQUIRED DOCUMENTS GUIDE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy text-white rounded-xl p-8 sm:p-10 border border-navy-700 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron">
              Required Documents Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              The 4 Standard Documentation Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Prepare digital and physical copies of these four categories before starting any certificate application:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white/10 border border-white/15 space-y-1.5">
              <div className="text-saffron font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-saffron" /> Proof of Identity
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Aadhaar Card, Voter Card (EPIC), Passport, or PAN Card.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/10 border border-white/15 space-y-1.5">
              <div className="text-digital-200 font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-digital-200" /> Proof of Residence
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Electricity Bill, Land Deed (Parcha), Ration Card, or Panchayat Certificate.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/10 border border-white/15 space-y-1.5">
              <div className="text-indiaGreen font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indiaGreen" /> Category / Income Proof
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Salary Slip, BDO Income Certificate, or Caste Certificate of blood relation.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/10 border border-white/15 space-y-1.5">
              <div className="text-white font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-white" /> Photo & Signature
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Recent colour photograph scanned under 200 KB in JPEG/PDF format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7C. ONLINE VS OFFLINE APPLICATION ASSISTANCE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-digital">
            Flexible Submission
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Online Application vs Bangla Sahayata Kendra
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Submit directly from your smartphone or visit your local administrative counter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Online Application Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-digital-50 text-digital border border-digital-200 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy">
                Online Application Portals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apply directly on verified Government of West Bengal web portals like e-District 2.0 or Oasis.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Accessible 24 hours a day, 7 days a week.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>External redirect modal verifies authentic state domains.</span>
                </div>
              </div>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-digital hover:bg-digital-600 text-white text-xs font-bold transition-colors"
            >
              <span>Explore Online Applications</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Offline BSK Guidance Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indiaGreen-50 text-indiaGreen border border-indiaGreen-200 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy">
                Bangla Sahayata Kendra (BSK)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Visit any of the 3,500+ official BSK desks in SDO, BDO, and Gram Panchayat offices for free operator help.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>100% Free: No operator service fees.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Operators scan your documents and hand you a printed slip.</span>
                </div>
              </div>
            </div>

            <Link
              to="/centre"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-navy hover:bg-navy-900 text-white text-xs font-bold transition-colors"
            >
              <MapPin className="w-4 h-4 text-saffron" />
              <span>Locate Nearest BSK Centre</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7D. BSK CENTRE DIRECTORY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-digital uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical Locations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Bangla Sahayata Kendra Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Find verified office addresses and published operating hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-white border border-slate-300 text-navy text-xs rounded-lg px-3 py-2 font-semibold focus:outline-none focus:border-digital"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 hover:border-digital transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-digital-50 text-digital border border-digital-200">
                    {centre.centre_type || 'Bangla Sahayata Kendra'}
                  </span>
                  <h3 className="text-base font-bold text-navy mt-1.5">{centre.name}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-700 bg-surface px-2.5 py-1 rounded">
                  {centre.district}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{centre.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{centre.operating_hours || '10:00 AM – 5:00 PM (Monday – Saturday)'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-500">Weekly Off: Sunday & State Holidays</span>
                <Link
                  to={`/centre?id=${centre.id}`}
                  className="font-bold text-digital hover:text-navy flex items-center gap-1"
                >
                  Centre Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7E. QUEUE TRACKING COMING SOON SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy text-white rounded-xl p-8 sm:p-10 border border-navy-700 space-y-5">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-saffron text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Roadmap Status: Coming Soon</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              BSK Queue Tracking — Coming Soon
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              We pledge never to publish fabricated or simulated queue wait times. Reliable live queue intelligence requires verified on-ground observers. We are currently calibrating pilot observer protocols in South 24 Parganas and North 24 Parganas before rolling out across West Bengal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-saffron">
                <CheckCircle2 className="w-4 h-4" /> Zero Fabricated Numbers
              </div>
              <p className="text-[11px] text-slate-300">
                No artificial counters or random guesswork. Only verified crowd density updates.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-digital-200">
                <CheckCircle2 className="w-4 h-4" /> Crowd Tiers (Low/Med/High)
              </div>
              <p className="text-[11px] text-slate-300">
                Clear categorization with 30-minute staleness safeguards so you are never misled.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indiaGreen">
                <CheckCircle2 className="w-4 h-4" /> Early Pilot Alerts
              </div>
              <p className="text-[11px] text-slate-300">
                Enter your email to receive a notification once live observations launch in your district.
              </p>
            </div>
          </div>

          {/* Email notify form */}
          <div className="pt-4 border-t border-navy-700 max-w-xl space-y-2">
            <p className="text-xs font-bold text-slate-200">
              Notify me when queue info goes live for my district:
            </p>
            {notifyDone ? (
              <div className="bg-indiaGreen/20 border border-indiaGreen/40 rounded-lg p-3 text-indiaGreen text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! We will alert you when live queue observation begins in {notifyDistrict}.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                <select
                  value={notifyDistrict}
                  onChange={(e) => setNotifyDistrict(e.target.value)}
                  className="bg-navy-900 text-white text-xs rounded-lg px-3 py-2 border border-navy-700 focus:outline-none focus:border-digital"
                >
                  <option value="Kolkata">Kolkata</option>
                  <option value="South 24 Parganas">South 24 Parganas</option>
                  <option value="North 24 Parganas">North 24 Parganas</option>
                  <option value="Howrah">Howrah</option>
                  <option value="Hooghly">Hooghly</option>
                </select>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1 bg-navy-900 text-white text-xs placeholder-slate-400 rounded-lg px-3 py-2 border border-navy-700 focus:outline-none focus:border-digital"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-saffron hover:bg-saffron-600 text-navy font-bold text-xs rounded-lg transition-colors"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Official External Redirect Warning Modal */}
      <ExternalRedirectModal
        isOpen={redirectModal.isOpen}
        onClose={() => setRedirectModal((prev) => ({ ...prev, isOpen: false }))}
        targetUrl={redirectModal.url}
        serviceName={redirectModal.serviceName}
        portalName={redirectModal.portalName}
      />
    </div>
  );
};

export default HomePage;
