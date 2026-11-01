import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Info
} from 'lucide-react';
import { publicService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const ServicesPage = () => {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Official West Bengal Citizen Services Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Government Certificates & Public Services
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Verify eligibility requirements, prepare your required documents checklist, check processing timelines, and access official application channels without intermediaries.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by certificate name (e.g. Income, Caste, Residence), department, or document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong className="text-slate-800">{filteredServices.length}</strong> services</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Info className="w-3.5 h-3.5" />
            All requirements verified from official West Bengal departmental guidelines
          </span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No Services Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any government service matching "{searchQuery}". Try searching for Income, Caste, or Residence.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isSaved = savedIds.has(service.id);
            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Top tags & bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                      {service.category || 'Certificate'}
                    </span>
                    <button
                      onClick={(e) => toggleSave(service.id, e)}
                      title={isSaved ? 'Remove from Saved' : 'Save Service'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Department */}
                  <div>
                    <Link
                      to={`/services/${service.id}`}
                      className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {service.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{service.department || 'Government of West Bengal'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Meta Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{service.expected_processing_time || '7 - 15 Days'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate font-medium">{service.fees || 'Free'}</span>
                    </div>
                  </div>

                  {/* Document preview */}
                  {service.required_documents && service.required_documents.length > 0 && (
                    <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100/70">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">Required Documents</span>
                        <span className="text-[11px] font-medium text-blue-600">
                          {service.required_documents.length} items
                        </span>
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-1">
                        {service.required_documents.slice(0, 2).map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{doc}</span>
                          </li>
                        ))}
                        {service.required_documents.length > 2 && (
                          <li className="text-[10px] text-slate-400 italic pl-4">
                            + {service.required_documents.length - 2} more documents...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer action buttons */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/services/${service.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span>Checklist & Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {service.online_apply_url && (
                    <button
                      onClick={(e) => handleApplyClick(service, e)}
                      title="Apply on Official State Portal"
                      className="inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm"
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
