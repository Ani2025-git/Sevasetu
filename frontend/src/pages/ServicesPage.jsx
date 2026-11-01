import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Building2,
  Copy,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { publicService } from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForDocs, setSelectedServiceForDocs] = useState(null);
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await publicService.getAllServices();
        if (res.data.success) {
          setServices(res.data.services);
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.required_documents && s.required_documents.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleCopyChecklist = (docs) => {
    if (!docs || docs.length === 0) return;
    navigator.clipboard.writeText(docs.join('\n'));
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-navy-900 to-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 [mask-image:radial-gradient(white,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Verified Document Guidelines • West Bengal BSK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Government Services & Document Checklists
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Eliminate unexpected rejection. Always verify the required certificates, photo formats, and income proof mandated by the department before arriving at the centre.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by service name, certificate type, or document keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredServices.length}</strong> of {services.length} services</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Official Government Portals Referenced
          </span>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading verified services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No services found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No service matched your current search filters. Try resetting the category or using broader keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-lg transition-all space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    {srv.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Verified: {srv.last_verified_at ? srv.last_verified_at.split('T')[0] : 'Recent'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-navy-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {srv.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {srv.description}
                </p>

                {/* Required Documents Section */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Document Checklist ({srv.required_documents?.length || 0})
                    </p>
                    <button
                      onClick={() => setSelectedServiceForDocs(srv)}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1">
                    {srv.required_documents?.slice(0, 2).map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Links */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {srv.official_source_url ? (
                  <a
                    href={srv.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:text-blue-800 font-bold inline-flex items-center gap-1 text-[11px]"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px]">In-Person Desk Only</span>
                )}
                <button
                  onClick={() => setSelectedServiceForDocs(srv)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors"
                >
                  Full Checklist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Checklist Details Modal */}
      {selectedServiceForDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-navy-900 text-white p-6 flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                  {selectedServiceForDocs.category}
                </span>
                <h3 className="font-bold text-lg text-white leading-snug">
                  {selectedServiceForDocs.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceForDocs(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedServiceForDocs.description}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Official Document Checklist:
                  </h4>
                  <button
                    onClick={() => handleCopyChecklist(selectedServiceForDocs.required_documents)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDoc ? 'Copied!' : 'Copy Checklist'}
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedServiceForDocs.required_documents && selectedServiceForDocs.required_documents.length > 0 ? (
                    selectedServiceForDocs.required_documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{doc}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No mandatory external documents noted; please bring government photo ID.
                    </p>
                  )}
                </div>
              </div>

              {selectedServiceForDocs.official_source_url && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <span>Apply or track online at official source:</span>
                  <a
                    href={selectedServiceForDocs.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline flex items-center gap-1"
                  >
                    External Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedServiceForDocs(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;

