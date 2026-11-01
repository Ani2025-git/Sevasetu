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
  Eye,
  Check
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

  const categories = [
    {
      title: 'Revenue & Income',
      desc: 'Income Certificate, Residential Proof, Character Certificate',
      count: '3 Services',
      icon: <FileText className="w-5 h-5 text-digital" />,
      tag: 'Income',
      borderColor: 'border-digital-200',
      badgeColor: 'bg-digital-50 text-digital',
    },
    {
      title: 'Social & Caste',
      desc: 'SC / ST / OBC Certificate, Caste Validation, Tribe Status',
      count: '4 Services',
      icon: <Award className="w-5 h-5 text-saffron" />,
      tag: 'Caste',
      borderColor: 'border-saffron-200',
      badgeColor: 'bg-saffron-50 text-saffron-800',
    },
    {
      title: 'Civil & Vital Records',
      desc: 'Birth Registration, Death Certificate, Domicile Proof',
      count: '3 Services',
      icon: <FileCheck className="w-5 h-5 text-indiaGreen" />,
      tag: 'Birth',
      borderColor: 'border-indiaGreen-200',
      badgeColor: 'bg-indiaGreen-50 text-indiaGreen-800',
    },
    {
      title: 'Food & Ration Supplies',
      desc: 'Digital Ration Card, Member Addition, NFSA / RKSY',
      count: '2 Services',
      icon: <Layers className="w-5 h-5 text-navy" />,
      tag: 'Ration',
      borderColor: 'border-navy-200',
      badgeColor: 'bg-navy-50 text-navy',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 2. HERO SECTION */}
      <section className="bg-navy text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-navy-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Subtle Civic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-saffron-100 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-saffron" />
            <span>Digital Citizen Assistance • West Bengal Public Services</span>
          </div>

          {/* Exact Required Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Your Government Services, <br className="hidden sm:inline" />
            <span className="text-saffron">Made Simple.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            Discover verified certificate guidelines, prepare your document checklist, and access official West Bengal application portals without intermediaries.
          </p>
          <p className="text-xs text-saffron-200 font-medium">
            আপনার সরকারি পরিষেবা, এখন আরও সহজ ও সুরক্ষিত।
          </p>

          {/* 3. LARGE SERVICE SEARCH BAR WITH SUGGESTIONS */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="relative shadow-sm rounded-xl overflow-hidden bg-white border border-slate-300 focus-within:border-digital transition-all">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Income, Caste, Residence, Birth, Ration Card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 bg-digital hover:bg-digital-600 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300 mt-3">
              <span className="text-slate-400 font-medium">Suggestions:</span>
              {[
                { label: 'Income Certificate', query: 'Income' },
                { label: 'Caste (SC/ST/OBC)', query: 'Caste' },
                { label: 'Residence / Domicile', query: 'Residence' },
                { label: 'Birth Certificate', query: 'Birth' },
                { label: 'Ration Card', query: 'Ration' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(`/services?search=${encodeURIComponent(item.query)}`)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white transition-colors border border-white/15 text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Digital Trust Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto border-t border-navy-700/70">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black text-saffron">3,500+</div>
              <div className="text-[11px] text-slate-300 mt-0.5">BSK Centres in WB</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black text-indiaGreen">₹0 Fee</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Free BSK Operator Service</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black text-digital-200">100%</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Verified Guidelines</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black text-white">0 Middlemen</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Direct State Portals</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-digital uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Public Service Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Browse by Service Categories
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-digital hover:text-navy flex items-center gap-1 hover:underline"
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
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-digital hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-surface border border-slate-200 flex items-center justify-center">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-navy group-hover:text-digital transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
                <span className="font-semibold text-slate-700">{cat.count}</span>
                <span className="text-digital font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR CERTIFICATE SERVICE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Frequent Citizen Applications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Popular Certificate Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Verified document requirements and direct links to West Bengal government portals.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-navy hover:bg-slate-50 transition-colors shrink-0"
          >
            <span>Full Directory ({services.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-digital hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded bg-digital-50 text-digital border border-digital-200">
                      {service.category || 'Certificate'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indiaGreen bg-indiaGreen-50 px-2 py-0.5 rounded border border-indiaGreen-200">
                      <ShieldCheck className="w-3 h-3 text-indiaGreen" />
                      Verified
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/services/${service.id}`}
                      className="text-lg font-bold text-navy hover:text-digital transition-colors line-clamp-1"
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
                    <div className="bg-surface p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Processing Days</span>
                      <span className="font-bold text-navy">{service.expected_processing_time || '7 - 15 Days'}</span>
                    </div>
                    <div className="bg-surface p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Official Fee</span>
                      <span className="font-bold text-indiaGreen">{service.fees || 'Free'}</span>
                    </div>
                  </div>

                  {service.required_documents && (
                    <div className="text-xs text-slate-700 flex items-center justify-between bg-digital-50/50 p-2.5 rounded-lg border border-digital-100">
                      <span className="font-semibold text-navy">Checklist:</span>
                      <span className="text-digital font-bold">{service.required_documents.length} Required Documents</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-surface border-t border-slate-200 flex items-center gap-2">
                  <Link
                    to={`/services/${service.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy hover:bg-navy-900 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors"
                  >
                    <span>Document Checklist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {service.online_apply_url && (
                    <button
                      onClick={(e) => handleApplyClick(service, e)}
                      className="inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-digital border border-digital-300 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors"
                      title="Apply on Official Portal"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS: SEARCH → CHECK DOCUMENTS → APPLY */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-digital">
              Simple 3-Step Citizen Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              How It Works: Search → Check Documents → Apply
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Prepare correctly before submitting online or visiting the Bangla Sahayata Kendra counter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-surface p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-digital text-white flex items-center justify-center font-bold">
                  1
                </div>
                <Search className="w-5 h-5 text-digital" />
              </div>
              <h3 className="font-bold text-base text-navy">Step 1: Search Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find your required West Bengal certificate or public scheme in our verified directory. Review published department fees and turnaround times.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-saffron text-navy font-bold">
                  2
                </div>
                <CheckSquare className="w-5 h-5 text-saffron" />
              </div>
              <h3 className="font-bold text-base text-navy">Step 2: Check Documents</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tick off identity proofs, address documents, photos, and affidavits on our interactive checklist. Never face application rejection due to missing paperwork.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-indiaGreen text-white font-bold">
                  3
                </div>
                <Building2 className="w-5 h-5 text-indiaGreen" />
              </div>
              <h3 className="font-bold text-base text-navy">Step 3: Apply Online or at BSK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click directly through to official government portals (e.g. e-District 2.0) or visit your nearest Bangla Sahayata Kendra for free operator assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REQUIRED DOCUMENTS INFORMATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-navy text-white rounded-2xl p-8 sm:p-10 border border-navy-700 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron">
              Document Preparation Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              The 4 Standard Pillars of Citizen Documentation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Ensure you possess valid digital or physical formats of these four categories before starting any application:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2">
              <div className="text-saffron font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-saffron" /> Proof of Identity (POI)
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Aadhaar Card, Voter Identity Card (EPIC), Passport, or PAN Card.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2">
              <div className="text-digital-200 font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-digital-200" /> Proof of Residence (POR)
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Electricity Bill, Land Deed (Parcha), Ration Card, or Gram Panchayat Certificate.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2">
              <div className="text-indiaGreen font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indiaGreen" /> Income & Category Proof
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Salary Slip, BDO / SDO Income Certificate, or Caste Certificate of blood relation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2">
              <div className="text-white font-bold text-xs uppercase flex items-center gap-1.5">
                <Check className="w-4 h-4 text-white" /> Photograph & Signature
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Recent passport-size colour photograph (scanned in under 200 KB in JPEG/PDF).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 & 9. ONLINE APPLICATION GUIDE & OFFLINE BSK ASSISTANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-digital">
            Multiple Application Modes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Apply Online with Safe Redirection or Visit BSK
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Choose the application path that suits your comfort and internet connectivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Online Application Guide Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-lg bg-digital-50 text-digital border border-digital-200 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-navy">
                8. Online Application Guide (Direct Portal)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apply directly from your phone or computer on verified West Bengal e-Governance portals such as e-District 2.0 or Oasis.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Always free to access 24 hours a day, 7 days a week.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Safe redirection modal confirms you are entering official state domains.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Immediate Application Identification Number (AIN) issued for tracking.</span>
                </div>
              </div>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-digital hover:bg-digital-600 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <span>Browse Online Portals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Offline BSK Guidance Card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-lg bg-indiaGreen-50 text-indiaGreen border border-indiaGreen-200 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-navy">
                9. Offline BSK Assistance (Bangla Sahayata Kendra)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Visit any of the 3,500+ official BSK counters situated in SDO, BDO, and Gram Panchayat offices. Dedicated Data Entry Operators assist you for free.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Zero government service charges (100% free assistance).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Document scanning and portal upload handled by operators.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
                  <span>Printed physical receipt handed to you on the spot.</span>
                </div>
              </div>
            </div>

            <Link
              to="/centre"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-navy hover:bg-navy-900 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <MapPin className="w-4 h-4 text-saffron" />
              <span>Locate Nearest BSK Centre</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. BANGLA SAHAYATA KENDRA CENTRE DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-digital uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical BSK Locator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              10. Bangla Sahayata Kendra Centre Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Locate verified office addresses, published operating hours, and weekly holiday schedules.
            </p>
          </div>

          {/* District selector */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 hover:border-digital transition-colors"
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
                <span className="text-slate-500">Weekly Off: Sunday & Gazetted Holidays</span>
                <Link
                  to={`/centre?id=${centre.id}`}
                  className="font-bold text-digital hover:text-navy flex items-center gap-1"
                >
                  View Centre Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. QUEUE TRACKING COMING SOON SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy text-white rounded-2xl p-8 sm:p-10 border border-navy-700 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-saffron text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Roadmap Status: Coming Soon</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              11. BSK Queue Tracking — Honest, Verified Data Only
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              We pledge never to publish fabricated or simulated queue wait times. Reliable live queue intelligence requires verified on-ground observers. We are currently calibrating pilot observer protocols in South 24 Parganas and North 24 Parganas before rolling out across West Bengal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-saffron">
                <CheckCircle2 className="w-4 h-4" /> Zero Fabricated Numbers
              </div>
              <p className="text-[11px] text-slate-300">
                No artificial counters or random guesswork. Only verified crowd density updates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-digital-200">
                <CheckCircle2 className="w-4 h-4" /> Crowd Tiers (Low/Med/High)
              </div>
              <p className="text-[11px] text-slate-300">
                Clear categorization with 30-minute staleness safeguards so you are never misled.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
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
                  className="bg-navy-900 text-white text-xs rounded-lg px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-digital"
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
                  className="flex-1 bg-navy-900 text-white text-xs placeholder-slate-400 rounded-lg px-3 py-2.5 border border-navy-700 focus:outline-none focus:border-digital"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-saffron hover:bg-saffron-600 text-navy font-bold text-xs rounded-lg transition-colors"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 12. TRUST AND INFORMATION VERIFICATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-digital-50 rounded-xl text-digital border border-digital-200 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-navy">
                12. Trust & Information Verification Pledge
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Seva Setu cross-references document requirements with official departmental gazettes of West Bengal. We never ask for Aadhaar cards, PAN numbers, or bank account credentials. All actual applications and certificate issuances occur solely on authorized government systems.
              </p>
            </div>
          </div>
          <Link
            to="/disclaimer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy hover:bg-navy-900 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Read Platform Charter
            <ChevronRight className="w-4 h-4" />
          </Link>
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
