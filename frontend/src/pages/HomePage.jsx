import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Users, 
  FileCheck, 
  ExternalLink,
  ChevronRight,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { publicService } from '../services/api';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // External Redirect Modal State
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    url: '',
    serviceName: '',
    portalName: 'Official West Bengal Government Portal',
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await publicService.getAllServices();
        if (res.data?.success && Array.isArray(res.data.services)) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  // Helper to find service link from backend by keyword
  const getServiceLink = (keyword, fallbackQuery) => {
    const match = services.find(s => 
      s.name.toLowerCase().includes(keyword.toLowerCase())
    );
    if (match) {
      return `/services/${match.id}`;
    }
    return `/services?search=${encodeURIComponent(fallbackQuery)}`;
  };

  // 4 Popular Services
  const popularServices = [
    {
      id: 'income',
      name: 'Income Certificate',
      description: 'Official annual family income proof for education, admissions, and scholarships.',
      icon: FileText,
      link: getServiceLink('income', 'Income'),
      department: 'Revenue & Land Reforms'
    },
    {
      id: 'caste',
      name: 'Caste Certificate',
      description: 'Caste verification certificates for SC, ST, and OBC category citizens.',
      icon: ShieldCheck,
      link: getServiceLink('caste', 'Caste'),
      department: 'Backward Classes Welfare'
    },
    {
      id: 'residence',
      name: 'Residence Certificate',
      description: 'Residential and domicile proof of living in West Bengal.',
      icon: MapPin,
      link: getServiceLink('residence', 'Residence'),
      department: 'Home & Hill Affairs'
    },
    {
      id: 'birth',
      name: 'Birth Certificate',
      description: 'Civil birth registration and verifiable digital birth certificates.',
      icon: Users,
      link: getServiceLink('birth', 'Birth'),
      department: 'Health & Family Welfare'
    }
  ];

  // Category Filtering for Explore Services
  const categories = [
    'All',
    'Certificates',
    'Revenue & Land',
    'Social Welfare',
    'Civil Registration',
    'Food & Supplies'
  ];

  const filteredExploreServices = services.filter(service => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Certificates') {
      return service.name.toLowerCase().includes('certificate') || 
             service.category?.toLowerCase().includes('certificate');
    }
    if (selectedCategory === 'Revenue & Land') {
      return service.department?.toLowerCase().includes('revenue') || 
             service.category?.toLowerCase().includes('revenue') ||
             service.name.toLowerCase().includes('income');
    }
    if (selectedCategory === 'Social Welfare') {
      return service.department?.toLowerCase().includes('welfare') || 
             service.category?.toLowerCase().includes('welfare') ||
             service.name.toLowerCase().includes('caste');
    }
    if (selectedCategory === 'Civil Registration') {
      return service.name.toLowerCase().includes('birth') || 
             service.name.toLowerCase().includes('death') ||
             service.category?.toLowerCase().includes('civil');
    }
    if (selectedCategory === 'Food & Supplies') {
      return service.name.toLowerCase().includes('ration') || 
             service.department?.toLowerCase().includes('food') ||
             service.category?.toLowerCase().includes('food');
    }
    return true;
  });

  return (
    <div className="bg-[#F5F7FA] text-[#263445] min-h-screen">
      {/* 3. HERO SECTION (Two-Column Layout) */}
      <section className="bg-gradient-to-b from-[#EAF2FC] via-[#EAF2FC]/70 to-[#F5F7FA] border-b border-blue-100/60 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Content & Search */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block text-xs font-bold tracking-wider text-[#2878C8] uppercase bg-white/80 px-3 py-1 rounded-full border border-blue-200/60 shadow-2xs">
                West Bengal Citizen Services
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#173B72] tracking-tight leading-tight">
                Government Services, <br className="hidden sm:inline" />
                <span className="text-[#F39A32]">Made Simple.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Discover official West Bengal certificate requirements, verify mandatory document checklists, and navigate official application portals without middlemen.
              </p>

              {/* One Prominent Service Search Bar */}
              <div className="pt-2 max-w-xl">
                <form 
                  onSubmit={handleHeroSearch} 
                  className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl border border-slate-300 shadow-sm focus-within:border-[#2878C8] focus-within:ring-2 focus-within:ring-[#2878C8]/15 transition-all p-1.5 gap-2"
                >
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search Income Certificate, Caste, Residence..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base text-[#173B72] placeholder-slate-400 font-medium bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#173B72] hover:bg-[#2878C8] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Clean Citizen Service Illustration Container */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
                <img
                  src="/assets/hero/digital-services.png"
                  alt="Indian citizen accessing digital public services"
                  className="w-full h-auto max-h-[360px] object-contain rounded-xl"
                  onError={(e) => {
                    // Fallback to local illustration
                    e.currentTarget.src = '/assets/hero/citizen-service.png';
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. POPULAR SERVICES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#173B72]">
            Popular Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Quick access to the most frequently requested West Bengal citizen certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#2878C8] hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF2FC] flex items-center justify-center text-[#2878C8] group-hover:bg-[#173B72] group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {service.department}
                    </span>
                    <h3 className="text-base font-bold text-[#173B72] mt-0.5 group-hover:text-[#2878C8] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2878C8] group-hover:text-[#173B72] transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. EXPLORE SERVICES */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#173B72]">
                Explore Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Browse official requirements, verified procedures, and document checklists.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2878C8] hover:text-[#173B72] transition-colors shrink-0"
            >
              <span>View All Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Clean Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#173B72] text-white shadow-xs'
                    : 'bg-[#F5F7FA] text-slate-600 hover:text-[#173B72] hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-[#F5F7FA] h-40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredExploreServices.length === 0 ? (
            <div className="text-center py-12 bg-[#F5F7FA] rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">No services found in this category.</p>
              <Link to="/services" className="text-xs text-[#2878C8] font-semibold mt-2 inline-block">
                View all available services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExploreServices.slice(0, 6).map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="bg-[#F5F7FA] rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between hover:bg-white hover:border-[#2878C8]/60 hover:shadow-md transition-all group"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-medium text-slate-500 truncate block">
                      {service.department || 'West Bengal Public Service'}
                    </span>
                    <h3 className="text-base font-bold text-[#173B72] group-hover:text-[#2878C8] transition-colors line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {service.description || 'View official documentation checklist and verified eligibility criteria.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {service.required_documents?.length 
                        ? `${service.required_documents.length} Required Documents` 
                        : 'Official Portal Guidelines'}
                    </span>
                    <span className="text-[#2878C8] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredExploreServices.length > 6 && (
            <div className="mt-10 text-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#173B72] text-[#173B72] hover:bg-[#173B72] hover:text-white font-medium text-sm transition-colors"
              >
                <span>Browse All {services.length} Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. BSK CENTRE SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EAF2FC] rounded-2xl border border-blue-100 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white text-[#173B72] flex items-center justify-center mx-auto shadow-xs border border-blue-200/60">
              <Building2 className="w-6 h-6 text-[#173B72]" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-[#173B72]">
              Find a Bangla Sahayata Kendra
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Find nearby assistance centres and explore available centre information. Trained operators assist citizens with digital portal submissions free of charge.
            </p>

            <div className="pt-3">
              <Link
                to="/centre"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#173B72] hover:bg-[#2878C8] text-white font-medium text-sm transition-colors shadow-xs"
              >
                <span>Explore BSK Centres</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#173B72]">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Three simple steps to prepare and complete your application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#F5F7FA] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-[#2878C8] font-bold text-base flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-[#173B72]">
                Find a Service
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Search our citizen guide to locate the required public certificate or scheme and check eligibility criteria.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#F5F7FA] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-[#2878C8] font-bold text-base flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-[#173B72]">
                Check Required Documents
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review the mandatory document checklist and gather required proofs before starting your application.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#F5F7FA] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-[#2878C8] font-bold text-base flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-[#173B72]">
                Apply through Official Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Follow direct links to verified West Bengal portals or visit your nearest BSK desk for assisted digital submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* External Redirect Modal */}
      <ExternalRedirectModal
        isOpen={redirectModal.isOpen}
        onClose={() => setRedirectModal(prev => ({ ...prev, isOpen: false }))}
        url={redirectModal.url}
        serviceName={redirectModal.serviceName}
        portalName={redirectModal.portalName}
      />
    </div>
  );
};

export default HomePage;
