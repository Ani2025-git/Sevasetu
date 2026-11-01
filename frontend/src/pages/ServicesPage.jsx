import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2,
  Bookmark,
  ChevronRight,
  IndianRupee,
  Sparkles,
  Info,
  X,
  Compass,
  Calendar
} from 'lucide-react';
import { publicService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const ServicesPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  
  // External Redirect Modal State
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    url: '',
    serviceName: '',
    portalName: 'Official West Bengal Government Portal',
  });

  useEffect(() => {
    const paramSearch = searchParams.get('search');
    if (paramSearch !== null && paramSearch !== searchQuery) {
      setSearchQuery(paramSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await publicService.getAllServices();
        if (res.data.success) {
          setServices(res.data.services);
          setCategories(res.data.categories || ['All']);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    const loadSaved = async () => {
      if (isAuthenticated) {
        try {
          const res = await publicService.getSavedServices();
          if (res.data.success) {
            setSavedIds(new Set(res.data.saved_services.map((s) => s.service_id)));
          }
        } catch {
          // ignore
        }
      }
    };

    loadServices();
    loadSaved();
  }, [isAuthenticated]);

  const toggleSave = async (serviceId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in as a citizen to save services to your dashboard.');
      return;
    }
    try {
      if (savedIds.has(serviceId)) {
        await publicService.removeSavedService(serviceId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(serviceId);
          return next;
        });
      } else {
        await publicService.saveService(serviceId);
        setSavedIds((prev) => new Set(prev).add(serviceId));
      }
    } catch (err) {
      console.error('Failed to update saved service', err);
    }
  };

  const handleApplyClick = (service, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!service.online_apply_url) return;
    setRedirectModal({
      isOpen: true,
      url: service.online_apply_url,
      serviceName: service.name,
      portalName: service.department || 'West Bengal e-District / State Portal',
    });
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch = 
      s.name.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q)) ||
      (s.required_documents && s.required_documents.some(d => d.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner - Digital India Style */}
      <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 border border-navy-700 space-y-3">
        <div className="inline-flex items-center gap-2 bg-saffron text-navy text-xs font-bold px-3 py-0.5 rounded uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>West Bengal Public Service Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Government Certificate Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-3xl">
          Complete eligibility guidelines, document requirements, expected processing times, and official direct application portals for citizens of West Bengal.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by certificate (e.g. Income, Caste, Residence), department, or document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-digital text-navy placeholder-slate-400 bg-surface"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-navy text-white'
                      : 'bg-surface text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong className="text-navy">{filteredServices.length}</strong> verified public services</span>
          <span className="flex items-center gap-1 text-slate-600">
            <Info className="w-3.5 h-3.5 text-digital" />
            Information cross-checked with official West Bengal notifications
          </span>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-navy">No Services Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any government service matching "{searchQuery}". Try searching for Income, Caste, or Residence.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-xs text-digital font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isSaved = savedIds.has(service.id);
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-digital hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-digital-50 text-digital border border-digital-200">
                      {service.category || 'Certificate'}
                    </span>
                    <button
                      onClick={(e) => toggleSave(service.id, e)}
                      title={isSaved ? 'Remove from Saved' : 'Save Service'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-saffron-50 text-saffron-700 border-saffron-300'
                          : 'text-slate-400 hover:text-navy border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-saffron' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <Link
                      to={`/services/${service.id}`}
                      className="text-lg font-bold text-navy hover:text-digital transition-colors line-clamp-1"
                    >
                      {service.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{service.department || 'Government of West Bengal'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-700 bg-surface p-2 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-digital shrink-0" />
                      <span className="truncate font-semibold">{service.expected_processing_time || '7 - 15 Days'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 bg-surface p-2 rounded-lg border border-slate-100">
                      <IndianRupee className="w-3.5 h-3.5 text-indiaGreen shrink-0" />
                      <span className="truncate font-bold text-indiaGreen">{service.fees || 'Free'}</span>
                    </div>
                  </div>

                  {service.required_documents && service.required_documents.length > 0 && (
                    <div className="space-y-1 bg-digital-50/40 p-2.5 rounded-lg border border-digital-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-navy">Required Documents</span>
                        <span className="text-[11px] font-bold text-digital">
                          {service.required_documents.length} items
                        </span>
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1">
                        {service.required_documents.slice(0, 2).map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-indiaGreen shrink-0" />
                            <span className="truncate">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3.5 bg-surface border-t border-slate-200 flex items-center gap-2">
                  <Link
                    to={`/services/${service.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy hover:bg-navy-900 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    <span>Checklist & Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {service.online_apply_url && (
                    <button
                      onClick={(e) => handleApplyClick(service, e)}
                      title="Apply on Official State Portal"
                      className="inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-digital border border-digital-300 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Warning Modal */}
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

export default ServicesPage;
