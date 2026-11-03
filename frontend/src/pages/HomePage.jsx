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
  ChevronLeft,
  Building2,
  CheckCircle2,
  Award
} from 'lucide-react';
import { publicService } from '../services/api';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

// Curated full-width hero slideshow using user-uploaded citizen service imagery
const HERO_SLIDES = [
  {
    id: 1,
    url: '/assets/hero/slider-rural-kendra.jpg',
    alt: 'Rural citizen and facilitator using digital service centre touchscreen',
    title: 'Digital Citizen Assistance'
  },
  {
    id: 2,
    url: '/assets/hero/slider-digital-form.jpg',
    alt: 'Citizen filling online public service form on laptop',
    title: 'Online Application Portal'
  },
  {
    id: 3,
    url: '/assets/hero/slider-citizen-desk.jpg',
    alt: 'Citizen receiving document assistance at public facilitation desk',
    title: 'Public Service Facilitation'
  },
  {
    id: 4,
    url: '/assets/hero/citizen-guidance.png',
    alt: 'Citizen service document checklist and guidance',
    title: 'Document Checklist & Verification'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  // Preload all slider images on mount
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.url;
    });
  }, []);

  // Preload next upcoming slide image dynamically
  useEffect(() => {
    const nextIdx = (currentSlide + 1) % HERO_SLIDES.length;
    const nextSlide = HERO_SLIDES[nextIdx];
    if (nextSlide) {
      const nextImg = new Image();
      nextImg.src = nextSlide.url;
    }
  }, [currentSlide]);

  // Automatic slide rotation every 6 seconds with hover pause
  useEffect(() => {
    if (isSliderHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isSliderHovered]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

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
      {/* 1. FULL-WIDTH HERO IMAGE SLIDER */}
      <section 
        className="relative w-full h-[480px] md:h-[500px] lg:h-[600px] overflow-hidden bg-slate-900 border-b border-slate-200/80"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
        aria-label="Government Services Hero Slider"
      >
        {/* Full-width Slides Layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                  isActive
                    ? `opacity-100 ${prefersReducedMotion ? 'scale-100' : 'scale-[1.03] duration-[6000ms] ease-out'}`
                    : 'opacity-0 scale-100 duration-1000'
                }`}
                style={{
                  backgroundImage: `url('${slide.url}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            );
          })}
        </div>

        {/* Subtle Left-to-Right Navy Gradient Overlay for Text Readability */}
        <div 
          className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 bg-gradient-to-r from-[#0b1c37]/90 via-[#0b1c37]/65 to-transparent pointer-events-none" 
        />

        {/* Soft Vertical Gradient for Top/Bottom Framing */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" 
        />

        {/* Hero Content (Positioned on the Left) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 text-left">
            {/* West Bengal Citizen Services Label */}
            <span className="inline-block text-xs font-bold tracking-wider text-[#F39A32] uppercase bg-navy-950/80 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-xs shadow-md">
              West Bengal Citizen Services
            </span>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Government Services, <br className="hidden sm:inline" />
              <span className="text-[#F39A32]">Made Simple.</span>
            </h1>

            {/* Exact Required Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Discover government services, understand required documents, and access official application portals through one simple platform.
            </p>

            {/* Prominent Service Search Bar */}
            <div className="pt-2 max-w-xl">
              <form 
                onSubmit={handleHeroSearch} 
                className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl border border-slate-300 shadow-2xl focus-within:border-[#2878C8] focus-within:ring-2 focus-within:ring-[#2878C8]/25 transition-all p-1.5 gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Income Certificate, Caste, Residence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm sm:text-base text-[#173B72] placeholder-slate-400 font-medium bg-transparent focus:outline-none"
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
        </div>

        {/* Previous / Next Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/20 hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/20 hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Small Slide Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" aria-label="Slideshow indicators">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full shadow-sm ${
                idx === currentSlide
                  ? 'w-7 h-2 bg-[#F39A32]'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. POPULAR SERVICES (Directly below the Hero Section) */}
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

      {/* 3. EXPLORE SERVICES */}
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

      {/* 4. GOVERNMENT WELFARE SCHEMES SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FC] text-[#2878C8] text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>West Bengal State Welfare</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#173B72]">
              Government Schemes
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Discover official welfare programs, verify your eligibility requirements, and access official application portals.
            </p>
          </div>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2878C8] hover:text-[#173B72] transition-colors shrink-0"
          >
            <span>Explore All Schemes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Lakshmir Bhandar',
              category: 'Women & Child Welfare',
              department: 'Women & Child Development and Social Welfare',
              desc: 'Basic monthly financial assistance of ₹1,000 to ₹1,200 for female heads of household.',
              slug: 'lakshmir-bhandar'
            },
            {
              name: 'Kanyashree Prakalpa',
              category: 'Education',
              department: 'Women & Child Development and Social Welfare',
              desc: 'Conditional cash transfer scheme to upgrade the status and education of adolescent girls.',
              slug: 'kanyashree-prakalpa'
            },
            {
              name: 'Swasthya Sathi',
              category: 'Health',
              department: 'Health & Family Welfare',
              desc: 'Basic health cover up to ₹5 Lakh per annum per family for secondary and tertiary care.',
              slug: 'swasthya-sathi'
            },
            {
              name: 'Krishak Bandhu (Assured Income)',
              category: 'Agriculture',
              department: 'Department of Agriculture',
              desc: 'Financial assistance of up to ₹10,000 per year per acre for agricultural landholders.',
              slug: 'krishak-bandhu'
            }
          ].map((sc, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#2878C8] hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#2878C8] uppercase tracking-wider bg-[#EAF2FC] px-2.5 py-0.5 rounded-full">
                    {sc.category}
                  </span>
                  <Award className="w-4 h-4 text-[#F39A32]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B72] group-hover:text-[#2878C8] transition-colors">
                    {sc.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{sc.department}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {sc.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to={`/schemes/${sc.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2878C8] group-hover:text-[#173B72] transition-colors"
                >
                  <span>Check Eligibility & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BSK CENTRE SECTION */}
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

      {/* 5. HOW IT WORKS */}
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
