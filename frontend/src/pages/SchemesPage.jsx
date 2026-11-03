import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Award,
  Search,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { schemeService } from '../services/api';
import ExternalRedirectModal from '../components/ExternalRedirectModal';
import { FALLBACK_SCHEMES } from '../data/fallbackSchemes';

const SCHEME_CATEGORIES = [
  { name: 'All Categories', slug: 'all' },
  { name: 'Education', slug: 'education' },
  { name: 'Health', slug: 'health' },
  { name: 'Women & Child Welfare', slug: 'women-child-welfare' },
  { name: 'Agriculture', slug: 'agriculture' },
  { name: 'Employment & Skill Development', slug: 'employment-skill-development' },
  { name: 'Financial Assistance', slug: 'financial-assistance' },
  { name: 'Social Welfare', slug: 'social-welfare' },
  { name: 'Housing', slug: 'housing' },
  { name: 'Senior Citizens', slug: 'senior-citizens' },
  { name: 'Other Government Schemes', slug: 'other-schemes' },
];

const SchemesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filters state from URL or default
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const deptParam = searchParams.get('dept') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedDept, setSelectedDept] = useState(deptParam);

  // Data states
  const [schemes, setSchemes] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // External Redirect Modal
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    url: '',
    schemeName: ''
  });

  // AI Finder Coming Soon Tooltip / Modal state
  const [showAiModal, setShowAiModal] = useState(false);

  // Fetch categories and departments on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          schemeService.getCategories(),
          schemeService.getDepartments()
        ]);
        if (catRes.data.success) {
          setCategoriesData(catRes.data.categories);
        }
        if (deptRes.data.success) {
          setDepartments(deptRes.data.departments);
        }
      } catch (err) {
        console.error('Error fetching scheme metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch schemes when filters or page changes
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page,
          per_page: 9,
        };
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (selectedDept) {
          params.department_id = selectedDept;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        try {
          const res = await schemeService.getSchemes(params);
          if (res.data && res.data.success && Array.isArray(res.data.schemes)) {
            setSchemes(res.data.schemes);
            setTotalCount(res.data.total !== undefined ? res.data.total : res.data.schemes.length);
            setTotalPages(res.data.pages !== undefined ? res.data.pages : 1);
            setIsFallback(false);
            setLoading(false);
            return;
          }
        } catch (apiErr) {
          console.warn('Live schemes API unreachable or spinning up, loading verified state cache:', apiErr);
        }

        // Verified offline fallback filter
        let filtered = [...FALLBACK_SCHEMES];
        if (selectedCategory && selectedCategory !== 'all') {
          filtered = filtered.filter(s => s.category_slug === selectedCategory);
        }
        if (selectedDept) {
          filtered = filtered.filter(s => String(s.department_id) === String(selectedDept));
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(s =>
            (s.name && s.name.toLowerCase().includes(q)) ||
            (s.short_description && s.short_description.toLowerCase().includes(q)) ||
            (s.beneficiary_summary && s.beneficiary_summary.toLowerCase().includes(q))
          );
        }
        setSchemes(filtered);
        setTotalCount(filtered.length);
        setTotalPages(1);
        setIsFallback(true);
      } catch (err) {
        console.error('Error in schemes loader, falling back to static verified schemes:', err);
        setSchemes(FALLBACK_SCHEMES);
        setTotalCount(FALLBACK_SCHEMES.length);
        setTotalPages(1);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [selectedCategory, selectedDept, searchQuery, page]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search: searchQuery, category: selectedCategory, dept: selectedDept });
  };

  // Handle Category Click
  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setPage(1);
    updateUrlParams({ search: searchQuery, category: slug, dept: selectedDept });
  };

  // Handle Department Change
  const handleDeptChange = (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    setPage(1);
    updateUrlParams({ search: searchQuery, category: selectedCategory, dept: deptId });
  };

  // Clear All Filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDept('');
    setPage(1);
    setSearchParams({});
  };

  // Helper to synchronize with URL
  const updateUrlParams = ({ search, category, dept }) => {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (category && category !== 'all') params.category = category;
    if (dept) params.dept = dept;
    setSearchParams(params);
  };

  // Handle External Apply Click
  const handleApplyClick = (scheme, e) => {
    e.stopPropagation();
    const targetUrl = scheme.official_application_url || scheme.official_info_url;
    if (targetUrl) {
      setRedirectModal({
        isOpen: true,
        url: targetUrl,
        schemeName: scheme.name
      });
    }
  };

  // Get count for a category from fetched categories metadata
  const getCategorySchemeCount = (slug) => {
    if (slug === 'all') return totalCount;
    const cat = categoriesData.find(c => c.slug === slug);
    return cat ? cat.scheme_count : 0;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#173B72] to-[#122e5a] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-saffron text-xs font-bold tracking-wider uppercase">
            <Award className="w-4 h-4" />
            <span>Citizen Empowerment & Welfare Schemes</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Explore Government Schemes
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
              Discover verified government welfare schemes, understand eligibility requirements, and access official state application portals for West Bengal.
            </p>
          </div>

          {/* Unified Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2 border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scheme name, beneficiary group, or welfare benefit..."
                className="w-full pl-11 pr-8 py-2.5 text-xs sm:text-sm text-[#263445] placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                    updateUrlParams({ search: '', category: selectedCategory, dept: selectedDept });
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2878C8] hover:bg-[#1f63a8] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <span>Search Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 2. AI SCHEME FINDER PROMOTION CARD */}
          <div className="max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#F39A32] text-[#173B72]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Not sure which scheme suits you?
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                Find government schemes that may match your personal eligibility criteria with our upcoming AI Scheme Finder.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-[#F39A32]" />
              <span>AI Scheme Finder – Coming Soon</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLS & FILTERS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
          {/* Header row with result count & department selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B72]">
              <Filter className="w-4 h-4 text-[#2878C8]" />
              <span>Filter by Welfare Category</span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {totalCount} Verified {totalCount === 1 ? 'Scheme' : 'Schemes'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Department Dropdown Filter */}
              <div className="relative min-w-[220px]">
                <select
                  value={selectedDept}
                  onChange={handleDeptChange}
                  className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-[#263445] focus:outline-none focus:border-[#2878C8]"
                >
                  <option value="">All Government Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.scheme_count || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button (shown only if active) */}
              {(selectedCategory !== 'all' || selectedDept || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* 10 Scheme Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SCHEME_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#173B72] text-white border-[#173B72] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#2878C8] hover:text-[#173B72]'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN SCHEMES GRID & LISTINGS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-slate-200 rounded w-28" />
                  <div className="h-4 bg-slate-200 rounded w-20" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded w-full" />
                  <div className="h-3.5 bg-slate-200 rounded w-5/6" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-8 bg-slate-200 rounded w-24" />
                  <div className="h-8 bg-slate-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="text-base font-bold text-rose-900">Failed to Load Schemes</h3>
            <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors inline-block"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && schemes.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF2FC] text-[#173B72] flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#173B72]">No Matching Schemes Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We could not find any government schemes matching your current filters. New welfare programs are continuously verified and added by administrators.
              </p>
            </div>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-[#173B72] hover:bg-[#2878C8] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Scheme Listing Cards Grid */}
        {!loading && !error && schemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#2878C8] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Card Body */}
                <div className="p-6 space-y-4">
                  {/* Category & Verified Badge */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#173B72] bg-[#EAF2FC] border border-[#2878C8]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {scheme.category_name}
                    </span>
                    {scheme.verification_status === 'VERIFIED' && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Verified Scheme</span>
                      </span>
                    )}
                  </div>

                  {/* Scheme Title */}
                  <div className="space-y-1">
                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="text-base sm:text-lg font-bold text-[#173B72] group-hover:text-[#2878C8] transition-colors line-clamp-2 leading-snug"
                    >
                      {scheme.name}
                    </Link>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{scheme.department_name}</span>
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {scheme.short_description}
                  </p>

                  {/* Beneficiary Pill */}
                  {scheme.beneficiary_summary && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <Users className="w-3.5 h-3.5 text-[#2878C8] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Target Beneficiaries
                        </p>
                        <p className="text-[11px] font-semibold text-[#263445] line-clamp-2 leading-tight">
                          {scheme.beneficiary_summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Last Verified Date */}
                  {scheme.last_verified_at && (
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>
                        Verified on {new Date(scheme.last_verified_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </p>
                  )}
                </div>

                {/* Bottom Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/schemes/${scheme.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#173B72] hover:bg-[#2878C8] text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {(scheme.official_application_url || scheme.official_info_url) && (
                    <button
                      type="button"
                      onClick={(e) => handleApplyClick(scheme, e)}
                      title="Apply on Official Government Portal"
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#2878C8] text-xs font-bold transition-colors shadow-2xs"
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

        {/* 5. PAGINATION CONTROLS */}
        {!loading && !error && totalPages > 1 && (
          <div className="pt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="text-xs font-bold text-slate-700 px-3">
              Page {page} of {totalPages}
            </div>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* AI SCHEME FINDER INFO MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#173B72] text-white p-5 flex items-start justify-between border-b border-navy-700">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#F39A32] text-[#173B72]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base leading-snug">AI Scheme Finder</h3>
                  <p className="text-[11px] text-slate-300">Phase 2 Intelligent Matcher</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                Our <strong>AI Scheme Finder</strong> is currently in development. It is designed to match citizens with relevant West Bengal and Central government welfare schemes based on deterministic eligibility rules (age, family income, residential jurisdiction, and occupational criteria).
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <p className="font-bold text-[11px] uppercase tracking-wider text-amber-800">
                  Ethical AI & Privacy Guarantee
                </p>
                <p className="text-[11px]">
                  The AI Scheme Finder will never store sensitive identity proofs such as Aadhaar, PAN numbers, or bank passwords. All eligibility recommendations will remain strictly advisory.
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-full py-2.5 bg-[#173B72] hover:bg-[#2878C8] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Got It, Thank You
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXTERNAL REDIRECT NOTICE MODAL */}
      <ExternalRedirectModal
        isOpen={redirectModal.isOpen}
        onClose={() => setRedirectModal({ isOpen: false, url: '', schemeName: '' })}
        targetUrl={redirectModal.url}
        serviceName={redirectModal.schemeName}
      />
    </div>
  );
};

export default SchemesPage;

