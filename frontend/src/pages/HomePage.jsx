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
  Layers,
  Sparkles,
  Compass,
  CheckSquare,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Landmark,
  FileCheck
} from 'lucide-react';
import { publicService } from '../services/api';

const HomePage = ({ onOpenQueueModal }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [centres, setCentres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [districts, setDistricts] = useState(['All']);
  const [loading, setLoading] = useState(true);

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

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const filteredCentres = centres.filter(c => {
    const matchDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    return matchDistrict;
  });

  return (
    <div className="space-y-20 pb-12">
      {/* SECTION B: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-navy-700/60">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Independent Citizen Assistance Platform • West Bengal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Government Services, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
              Made Simpler.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Find government services, understand required documents, and access official application portals — all in one place.
          </p>

          {/* Prominent Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="relative shadow-2xl rounded-2xl overflow-hidden">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Income Certificate, Caste Certificate, Residence Certificate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 sm:pr-32 py-4 bg-white text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Popular searches: <button type="button" onClick={() => navigate('/services?search=Income')} className="text-blue-300 hover:underline">Income Certificate</button>, <button type="button" onClick={() => navigate('/services?search=Caste')} className="text-blue-300 hover:underline">SC/ST/OBC</button>, <button type="button" onClick={() => navigate('/services?search=Residence')} className="text-blue-300 hover:underline">Residential Domicile</button>
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/services"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Explore Government Services
            </Link>
            <Link
              to="/centre"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Building2 className="w-4 h-4" />
              Find a BSK Centre
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION C: POPULAR GOVERNMENT SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Layers className="w-3.5 h-3.5" />
              Verified Certificate Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Popular Government Certificate Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Officially referenced eligibility, required document checklists, and application links in West Bengal.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            View All Services ({services.length})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading verified certificate guides...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      {service.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-navy-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Document preview snippet */}
                  {service.required_documents && service.required_documents.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                        Documents to Carry ({service.required_documents.length}):
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {service.required_documents[0]}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Dept: <span className="font-semibold text-slate-700 truncate max-w-[140px] inline-block align-bottom">{service.department || 'Govt of WB'}</span>
                  </div>
                  <Link
                    to={`/services/${service.id}`}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION D: HOW SEVA SETU WORKS */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              How Seva Setu Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Four simple, transparent steps to navigate government services with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-base text-navy-900">Search Government Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find the certificate or scheme you need—from Income & Caste certificates to Ration cards and scholarships.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-base text-navy-900">Check Required Documents</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified eligibility rules, mandatory proofs, photo dimensions, and income ceilings before applying.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-base text-navy-900">Prepare Your Checklist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mark documents as gathered, avoid repeat visits, and ensure your application package has zero missing files.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-base flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-base text-navy-900">Apply Directly or In-Person</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apply online via verified state portals or visit your nearest Bangla Sahayata Kendra (BSK) for free assisted filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: DOCUMENT PREPARATION & DUAL APPLICATION GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Document Prep Card */}
          <div className="bg-gradient-to-br from-navy-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xl border border-navy-800">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Zero Rejection Strategy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Prepare Before You Apply
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Most rejected government certificate applications result from minor documentation errors: expired income certificates, missing Aadhaar mobile linkage, or invalid witness statements.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-200">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Check exact mandatory vs conditional supporting proofs</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive digital document checklist for your pocket</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Step-by-step instructions before leaving home</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-800">
              <Link
                to="/services?focus=documents"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2 transition-all shadow-md"
              >
                Explore Document Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Online vs Offline Dual Guidance Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Dual Application Pathways</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                Apply Online or Offline
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seva Setu guides citizens whether you prefer submitting from home on your phone or getting free assistance at a local office.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                  <p className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-blue-700" />
                    Online Application
                  </p>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    Direct verified links to official portals (e-District, Janma-Mrityu Tathya, Caste Portal) with zero third-party agent charges.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                  <p className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    Offline / BSK Assistance
                  </p>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Locate nearby Bangla Sahayata Kendras (BSK) where government operators assist with free document scanning and submission.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Find operating hours & holiday lists</span>
              <Link to="/centre" className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                Locate Nearest BSK <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: BSK CENTRE LOCATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Grassroots Public Assistance
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Find Your Nearest Bangla Sahayata Kendra
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Locate government-operated BSK assistance desks across districts and blocks in West Bengal.
            </p>
          </div>

          {/* District filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {centre.district}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Block: {centre.block}
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-navy-900 leading-snug">
                    {centre.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{centre.address}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Published Hours</span>
                  <span className="font-semibold text-slate-800">{centre.opening_hours}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Weekly Holidays</span>
                  <span className="font-semibold text-slate-800">{centre.weekly_holidays}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Free assisted government services</span>
                <Link
                  to={`/centre?id=${centre.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  View Centre Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION G: QUEUE INFORMATION (COMING SOON FEATURE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>BSK Queue Tracking • Coming Soon</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Evidence-Based Crowd Information Under Development
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We believe citizen trust requires absolute transparency. Seva Setu is preparing permission-based on-site crowd monitoring. We strictly refuse to display fabricated live numbers or simulated queue times.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Low / Moderate / High crowd categories</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> 30-min auto-staleness filter</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Verified source attribution</span>
            </div>
          </div>

          <div className="shrink-0 space-y-3 text-center lg:text-right">
            <button
              onClick={onOpenQueueModal}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Learn About Queue Feature
            </button>
            <p className="text-[11px] text-slate-400">
              Currently in pilot roadmap testing
            </p>
          </div>
        </div>
      </section>

      {/* SECTION H: WHY SEVA SETU? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Why West Bengal Citizens Choose Seva Setu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A trustworthy, privacy-respecting bridge between citizens and public services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              title: "Easy Discovery",
              desc: "Instant search across certificates, pensions, health cards, and welfare programs.",
              icon: Search,
              color: "text-blue-600 bg-blue-50"
            },
            {
              title: "Verified Documents",
              desc: "Exact photo counts, income proofs, and residence criteria with zero guesswork.",
              icon: FileCheck,
              color: "text-emerald-600 bg-emerald-50"
            },
            {
              title: "Direct Official Links",
              desc: "No middlemen or fake fees. Transparent redirects to official state government portals.",
              icon: ExternalLink,
              color: "text-purple-600 bg-purple-50"
            },
            {
              title: "BSK Centre Guides",
              desc: "Published operating hours, gazetted holidays, and offline application guidance.",
              icon: Building2,
              color: "text-amber-600 bg-amber-50"
            },
            {
              title: "Zero Citizen PII",
              desc: "We never ask for your Aadhaar, bank details, or document uploads. 100% privacy.",
              icon: ShieldCheck,
              color: "text-rose-600 bg-rose-50"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2.5 text-center flex flex-col items-center justify-start hover:border-blue-300 transition-all"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-navy-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION I: IMPORTANT NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-amber-950">
              <p className="font-bold text-sm text-amber-900">Important Disclaimer</p>
              <p className="leading-relaxed">
                "Seva Setu is an independent citizen assistance platform and is not an official government website."
                All application links redirect safely to legitimate state portals (such as edistrict.wb.gov.in, castcertificatewb.gov.in, janmasadak.wb.gov.in).
              </p>
            </div>
          </div>
          <Link
            to="/disclaimer"
            className="px-4 py-2 bg-white text-amber-900 border border-amber-300 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-amber-100 transition-colors shadow-xs"
          >
            Read Full Charter
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
