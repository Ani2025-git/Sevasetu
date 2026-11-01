import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Layers,
  Sparkles
} from 'lucide-react';
import { publicService } from '../services/api';
import QueueBadge from '../components/QueueBadge';

const HomePage = ({ onOpenObservationModal }) => {
  const [centres, setCentres] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [centresRes, servicesRes] = await Promise.all([
          publicService.getCentres(),
          publicService.getAllServices()
        ]);
        if (centresRes.data.success) {
          setCentres(centresRes.data.centres);
        }
        if (servicesRes.data.success) {
          setServices(servicesRes.data.services);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pilotCentre = centres[0] || null;

  const filteredCentres = centres.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Independent Citizen Information Pilot • West Bengal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Know Before <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">You Visit.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            SevaQueue helps citizens prepare for visiting Bangla Sahayata Kendras (BSK) with published operating hours, officially referenced document checklists, and reviewed crowd observations.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/centre"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Explore Pilot Centre
            </Link>
            <Link
              to="/queue"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Clock className="w-4 h-4" />
              View Queue Status
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Services & Documents
            </Link>
          </div>

          {/* Search Box */}
          <div className="pt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search pilot centres by district, block or centre name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-900/90 transition-all backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Centre Spotlight & Real-time Queue Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Pilot Centre Card (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                    Pilot Centre
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                    Sample Data
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                  {pilotCentre?.name || 'SevaQueue Pilot Centre — Sample BSK'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{pilotCentre?.address || 'Sample Location, South 24 Parganas, West Bengal'}</span>
                </p>
              </div>

              {/* Live Badge */}
              <div className="text-right">
                <QueueBadge
                  status={pilotCentre?.queue_summary?.status}
                  isStale={pilotCentre?.queue_summary?.is_stale}
                  size="lg"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  {pilotCentre?.queue_summary?.is_stale ? (
                    <span className="text-amber-600 font-semibold">Stale (Over 30 mins)</span>
                  ) : (
                    <span>Last updated: {pilotCentre?.queue_summary?.minutes_ago ?? 0}m ago</span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Operating Hours
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {pilotCentre?.opening_hours || '10:00 AM - 5:00 PM'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mon - Sat (Holidays closed)</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Available Services
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {pilotCentre?.service_count || services.length} BSK Services
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Verified document guides</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  Reviewed Reports
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {pilotCentre?.queue_summary?.supporting_observations || 2} Observations
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Source: {pilotCentre?.queue_summary?.source_type || 'OBSERVER_VERIFIED'}
                </p>
              </div>
            </div>

            {/* Action footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                District: <strong className="text-slate-800">{pilotCentre?.district || 'South 24 Parganas'}</strong> • Block: <strong className="text-slate-800">{pilotCentre?.block || 'Bhangar I'}</strong>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/centre?id=${pilotCentre?.id || 1}`}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                >
                  Full Centre Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {onOpenObservationModal && (
                  <button
                    onClick={onOpenObservationModal}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
                  >
                    Submit Observation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Current Queue Status & Reliability Sidebar Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Clock className="w-4 h-4 text-blue-600" />
                Queue Intelligence
              </div>
              <h3 className="text-lg font-bold text-navy-900 leading-tight">
                Information Reliability & Queue Protocol
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pilotCentre?.queue_summary?.reliability_note || 
                  'Queue information reflects reviewed community observations or sample demo metrics.'}
              </p>

              {pilotCentre?.queue_summary?.is_stale && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="font-medium">
                    No Recent Update — Please confirm operating conditions with the centre.
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Source Type:</span>
                  <span className="font-semibold text-slate-800">
                    {pilotCentre?.queue_summary?.source_type || 'OBSERVER_VERIFIED'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Stale Threshold:</span>
                  <span className="font-semibold text-slate-800">
                    {pilotCentre?.queue_summary?.stale_threshold_minutes || 30} minutes
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Community Evidence:</span>
                  <span className="font-semibold text-slate-800">
                    {pilotCentre?.queue_summary?.recent_observations_count || 2} recent reports
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/queue"
                className="w-full text-center block text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                Inspect Live Queue Monitor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Service Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Layers className="w-3.5 h-3.5" />
              Service Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
              Essential Government Service Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Know the exact documents required before stepping out of your house.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            Browse All Services ({services.length})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  {service.category}
                </span>
                <h3 className="font-bold text-base text-navy-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {service.required_documents && service.required_documents.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 uppercase">Documents to carry:</p>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {service.required_documents[0]}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {service.official_source_url ? (
                  <a
                    href={service.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px]">BSK In-Person</span>
                )}
                <Link
                  to="/services"
                  className="font-bold text-slate-800 hover:text-blue-700 flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              How SevaQueue Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Three simple steps for a seamless, well-prepared visit to your local government service centre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-base text-navy-900">Search Service & Check Documents</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified requirements for certificates, ration cards, or pensions beforehand to avoid multiple visits and rejected applications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-base text-navy-900">Verify Operating Hours</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirm active hours, lunch intervals, and weekly gazetted holiday schedules for the specific Bangla Sahayata Kendra location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-base text-navy-900">Check Crowd Status</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review recently published queue indicators (Low, Moderate, High, or Stale) supported by field observer verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Independent Demonstration Notice Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Independent Project • Ethical Tech Prototype</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Civic Innovation for Bengal Citizens
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SevaQueue was designed as an independent proof-of-concept to demonstrate how transparent queue information and structured service guidance can significantly reduce citizen wait times and administrative burden.
            </p>
          </div>
          <div className="shrink-0 space-y-3 text-center md:text-right">
            <Link
              to="/disclaimer"
              className="px-6 py-3 rounded-xl bg-white text-navy-900 hover:bg-slate-100 font-bold text-xs inline-block transition-colors shadow-lg"
            >
              Read Pilot Charter & Disclaimer
            </Link>
            <p className="text-[11px] text-slate-400">
              Zero citizen tracking • No Aadhaar stored
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

