import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { publicService } from '../services/api';
import { 
  User, 
  Bookmark, 
  FileText, 
  ExternalLink, 
  Trash2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [savedServices, setSavedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // External Redirect Modal
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    url: '',
    serviceName: '',
    portalName: 'Official West Bengal Government Portal',
  });

  const loadSavedServices = async () => {
    try {
      setLoading(true);
      const res = await publicService.getSavedServices();
      if (res.data.success) {
        setSavedServices(res.data.saved_services);
      }
    } catch (err) {
      console.error('Error loading saved services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedServices();
  }, []);

  const handleRemove = async (serviceId, e) => {
    e.preventDefault();
    try {
      await publicService.removeSavedService(serviceId);
      setSavedServices((prev) => prev.filter((s) => s.service_id !== serviceId));
    } catch (err) {
      console.error('Failed to remove service:', err);
    }
  };

  const handleApplyClick = (service, e) => {
    e.preventDefault();
    if (!service.online_apply_url) return;
    setRedirectModal({
      isOpen: true,
      url: service.online_apply_url,
      serviceName: service.name,
      portalName: service.department || 'West Bengal e-District',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300 border border-white/20">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Citizen Portal
              </div>
              <h1 className="text-2xl font-black text-white">
                {user?.full_name || 'Citizen User'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Browse All Services</span>
            </Link>
            <Link
              to="/centre"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-white/20"
            >
              <MapPin className="w-4 h-4" />
              <span>Find Nearest BSK</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section: Saved Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600" />
              Saved Services & Document Checklists
            </h2>
            <p className="text-xs text-slate-500">
              Services you have bookmarked for quick preparation and direct application.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {savedServices.length} Saved
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : savedServices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">
              No Saved Services Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save services like Income Certificate, Caste Certificate, or Residence Certificate to easily track your required documents.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Explore Certificate Directory
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedServices.map(({ service_id, service, saved_at }) => {
              if (!service) return null;
              return (
                <div
                  key={service_id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {service.category || 'Certificate'}
                      </span>
                      <button
                        onClick={(e) => handleRemove(service_id, e)}
                        title="Remove from saved"
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      to={`/services/${service.id}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors block line-clamp-1"
                    >
                      {service.name}
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{service.department || 'West Bengal'}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {service.expected_processing_time || '7 - 15 Days'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        {service.required_documents?.length || 0} Required Docs
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Link
                      to={`/services/${service.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                    >
                      <span>Checklist & Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {service.online_apply_url && (
                      <button
                        onClick={(e) => handleApplyClick(service, e)}
                        className="inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-blue-700 border border-slate-300 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
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
      </div>

      {/* Helpful Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Checklist Tip: Digital Copies
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ensure your photo and document files are scanned in color and kept under 200 KB in PDF/JPG format before proceeding to official application portals.
          </p>
        </div>

        <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
            <Clock className="w-4 h-4 text-blue-600" />
            BSK Queue Feature — Coming Soon
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            We are preparing a transparent observation-based queue monitoring pilot for Bangla Sahayata Kendras. No fake numbers will ever be shown.
          </p>
        </div>
      </div>

      {/* External Redirect Modal */}
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

export default CitizenDashboard;

