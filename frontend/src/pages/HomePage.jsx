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
  FileCheck,
  Award,
  Zap,
  IndianRupee,
  Bell,
  Smartphone,
  Eye
} from 'lucide-react';
import { publicService } from '../services/api';

const HomePage = ({ onOpenObservationModal }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [centres, setCentres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [districts, setDistricts] = useState(['All']);
  const [loading, setLoading] = useState(true);

  // Queue notify state
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDistrict, setNotifyDistrict] = useState('Kolkata');
  const [notifyDone, setNotifyDone] = useState(false);

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

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyDone(true);
  };

  const filteredCentres = centres.filter(c => {
    return selectedDistrict === 'All' || c.district === selectedDistrict;
  });

  const categories = [
    {
      title: 'Revenue & Income',
      desc: 'Income Certificate, Residential Proof, Character Certificate',
      count: '3 Services',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      tag: 'Income',
      bg: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      title: 'Social & Caste',
      desc: 'SC / ST / OBC Certificate, Caste Validation, Tribe Status',
      count: '4 Services',
      icon: <Award className="w-5 h-5 text-indigo-600" />,
      tag: 'Caste',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
      title: 'Civil & Vital Records',
      desc: 'Birth Registration, Death Certificate, Domicile Proof',
      count: '3 Services',
      icon: <FileCheck className="w-5 h-5 text-teal-600" />,
      tag: 'Birth',
      bg: 'bg-teal-50 text-teal-700 border-teal-100',
    },
    {
      title: 'Food & Ration Supplies',
      desc: 'Digital Ration Card, Member Addition, NFSA / RKSY',
      count: '2 Services',
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      tag: 'Ration',
      bg: 'bg-amber-50 text-amber-700 border-amber-100',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-navy-800">
        {/* Subtle grid pattern & decorative blur */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Independent Citizen Assistance Platform • West Bengal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Government Services, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
              Made Simpler.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
            Discover verified certificate guidelines, prepare your required documents checklist, and access official West Bengal portals without middlemen.
          </p>

          {/* Unified Large Search Input */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="relative shadow-2xl rounded-2xl overflow-hidden group focus-within:ring-4 focus-within:ring-blue-500/30 transition-all">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search Income Certificate, SC/ST/OBC Caste, Residence, Birth..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 sm:pr-36 py-4 sm:py-4.5 bg-white text-slate-800 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 mt-3.5">
              <span className="text-slate-400 font-medium">Popular:</span>
              {[
                { label: 'Income Certificate', query: 'Income' },
                { label: 'Caste Certificate', query: 'Caste' },
                { label: 'Residential Domicile', query: 'Residence' },
                { label: 'Birth Registration', query: 'Birth' },
                { label: 'Ration Card', query: 'Ration' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(`/services?search=${encodeURIComponent(item.query)}`)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors border border-white/10 text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto border-t border-navy-800/80">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-blue-400">3,500+</div>
              <div className="text-[11px] text-slate-300 mt-0.5">BSK Centres State-Wide</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">₹0 Fee</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Free BSK Application</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-sky-400">100%</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Verified Guidelines</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-400">0 Middlemen</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Direct Official Portals</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore by Domain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Service Categories
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View All Public Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/services?search=${cat.tag}`)}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
                <span className="font-semibold text-slate-700">{cat.count}</span>
                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Browse <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: POPULAR CERTIFICATE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>High Demand Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Public Certificates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Most frequently requested citizen certificates with pre-requisite document verification.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
          >
            <span>Full Directory ({services.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                      {service.category || 'Certificate'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/services/${service.id}`}
                      className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {service.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {service.department || 'Government of West Bengal'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Processing Time</span>
                      <span className="font-bold text-slate-800">{service.expected_processing_time || '7 - 15 Days'}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Official Fee</span>
                      <span className="font-bold text-emerald-700">{service.fees || 'Free'}</span>
                    </div>
                  </div>

                  {service.required_documents && (
                    <div className="text-xs text-slate-600 flex items-center justify-between bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
                      <span className="font-semibold text-slate-700">Checklist:</span>
                      <span className="text-blue-700 font-bold">{service.required_documents.length} Required Documents</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/services/${service.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span>Document Checklist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: 4-STEP HOW IT WORKS */}
      <section className="bg-slate-100/80 py-16 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Seva Setu Assists Citizens
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Eliminate rejected applications and unexpected trips by completing preparations upfront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Search Service',
                desc: 'Locate your required certificate or public scheme with our verified West Bengal catalog.',
                icon: <Search className="w-5 h-5 text-blue-600" />,
              },
              {
                step: '02',
                title: 'Review Checklist',
                desc: 'Tick off identity proof, residence proof, and required income documents before applying.',
                icon: <CheckSquare className="w-5 h-5 text-indigo-600" />,
              },
              {
                step: '03',
                title: 'Choose Online or BSK',
                desc: 'Apply directly through state portals or visit your nearest Bangla Sahayata Kendra for free operator help.',
                icon: <Building2 className="w-5 h-5 text-teal-600" />,
              },
              {
                step: '04',
                title: 'Track Official Status',
                desc: 'Keep your acknowledgment slip number and monitor verification progress directly with the department.',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: ONLINE VS OFFLINE APPLICATION GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Citizen Freedom of Choice
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Apply Online or Visit a Nearby Counter
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Whether you are computer-savvy or prefer in-person human assistance, both channels are 100% legitimate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Online Application Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Channel A: Direct Online Application
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apply directly from your smartphone or laptop on official West Bengal e-Governance portals such as e-District 2.0 or Oasis Caste Portal.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Available 24/7 without travelling to government offices.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Immediate digital acknowledgment receipt generated.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Safe direct redirection modal verifies the authentic domain.</span>
                </div>
              </div>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              <span>Explore Online Applications</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Offline BSK Counter Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Channel B: Bangla Sahayata Kendra (BSK)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Visit any of the 3,500+ official BSK counters situated in SDO, BDO, and Gram Panchayat offices. Dedicated Data Entry Operators assist you for free.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero government service charges (100% free assistance).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Document scanning and portal upload handled by operators.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Printed physical receipt handed to you on the spot.</span>
                </div>
              </div>
            </div>

            <Link
              to="/centre"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Locate Nearest BSK Centre</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: BSK LOCATOR PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical Centres</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bangla Sahayata Kendra Locator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find verified office locations, operating hours, and contact details.
            </p>
          </div>

          {/* District selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {centre.centre_type || 'Bangla Sahayata Kendra'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{centre.name}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {centre.district}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{centre.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{centre.operating_hours || '10:00 AM – 5:00 PM (Monday to Saturday)'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-400">Weekly Off: Sunday & State Holidays</span>
                <Link
                  to={`/centre?id=${centre.id}`}
                  className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: QUEUE COMING SOON ROADMAP & NOTIFICATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/60 relative overflow-hidden space-y-8">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-400/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>BSK Queue Intelligence • Roadmap Status: Coming Soon</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              We Do Not Guess Queue Times. Reliable Data Coming Soon.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike platforms that display fake or simulated counters, Seva Setu will only publish BSK queue updates backed by verified, empirical on-ground observations. We are calibrating our field observer network in pilot centres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                No Simulated Wait Times
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Zero arbitrary numbers. Every update must be verified by registered observers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
                Crowd Density Levels
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Categorization into Light, Moderate, and High crowd tiers with staleness indicators.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <CheckCircle2 className="w-4 h-4" />
                Phase 1 District Pilot
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Rolling out at high-density BSK counters across South 24 Parganas and North 24 Parganas.
              </p>
            </div>
          </div>

          {/* Email notify form */}
          <div className="pt-4 border-t border-navy-800 max-w-xl space-y-3">
            <p className="text-xs font-bold text-slate-200">
              Get notified when queue info goes live for your area:
            </p>
            {notifyDone ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! We will alert you when queue observations activate in {notifyDistrict}.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                <select
                  value={notifyDistrict}
                  onChange={(e) => setNotifyDistrict(e.target.value)}
                  className="bg-navy-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 bg-navy-900 text-white text-xs placeholder-slate-400 rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8: INDEPENDENT NOTICE & DATA SAFETY PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-800 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-amber-950">
                Citizen Safety & Data Privacy Commitment
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed max-w-3xl">
                Seva Setu does not process, store, or upload sensitive citizen documents (such as Aadhaar, PAN, or bank cards). We will never ask you for OTPs or payments. All applications must be filed directly on official government servers or at registered BSK desks.
              </p>
            </div>
          </div>
          <Link
            to="/disclaimer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Read Disclaimer
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
