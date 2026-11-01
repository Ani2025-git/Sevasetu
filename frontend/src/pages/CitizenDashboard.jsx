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
  AlertCircle,
  Bell,
  Eye,
  History,
  CheckSquare
} from 'lucide-react';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'recent', 'notifications'
  const [savedServices, setSavedServices] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
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

    // Load recently viewed services from localStorage
    try {
      const recentStr = localStorage.getItem('sevasetu_recently_viewed');
      if (recentStr) {
        setRecentServices(JSON.parse(recentStr));
      }
    } catch {
      // ignore
    }
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

  const getChecklistProgress = (serviceId, totalDocs) => {
    if (!totalDocs || totalDocs === 0) return { count: 0, percent: 0 };
    try {
      const savedProgress = localStorage.getItem(`sevasetu_checklist_${serviceId}`);
      if (!savedProgress) return { count: 0, percent: 0 };
      const parsed = JSON.parse(savedProgress);
      const count = Object.values(parsed).filter(Boolean).length;
      return { count, percent: Math.round((count / totalDocs) * 100) };
    } catch {
      return { count: 0, percent: 0 };
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'West Bengal e-District 2.0 Integration',
      desc: 'All income and residence certificate guidance updated in accordance with latest state portal circulars.',
      date: 'Today',
      type: 'info',
    },
    {
      id: 2,
      title: 'Bangla Sahayata Kendra Free Application Guarantee',
      desc: 'Remember: BSK operators cannot charge application processing fees. All assistance is 100% free.',
      date: 'Yesterday',
      type: 'alert',
    },
    {
      id: 3,
      title: 'Queue Feature Pilot Calibration',
      desc: 'Observer verification is currently active in pilot BSK centres across South 24 Parganas.',
      date: '3 days ago',
      type: 'update',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-blue-500/10 [mask-image:radial-gradient(white,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300 border border-white/20 font-black text-2xl shadow-inner">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'C')}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Citizen Portal Profile
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.full_name || user?.name || 'Citizen User'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Browse All Services</span>
            </Link>
            <Link
              to="/centre"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-white/20"
            >
              <MapPin className="w-4 h-4 text-blue-300" />
              <span>Find BSK Centre</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 max-w-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Saved Services</span>
            <span className="text-lg font-bold text-white">{savedServices.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Recently Viewed</span>
            <span className="text-lg font-bold text-white">{recentServices.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">BSK Assistance</span>
            <span className="text-lg font-bold text-emerald-400">100% Free</span>
          </div>
        </div>
      </div>

      {/* Modern Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-navy-950 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Checklists ({savedServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'recent'
              ? 'bg-navy-950 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recently Viewed ({recentServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'notifications'
              ? 'bg-navy-950 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Circulars</span>
        </button>
      </div>

      {/* TAB CONTENT: SAVED SERVICES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Bookmarked Services & Document Progress
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Checklist state is saved automatically to your device
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse" />
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
                className="inline-flex items-center gap-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Explore Certificate Directory
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedServices.map(({ service_id, service, saved_at }) => {
                if (!service) return null;
                const totalDocs = service.required_documents?.length || 0;
                const { count: completedCount, percent } = getChecklistProgress(service.id, totalDocs);

                return (
                  <div
                    key={service_id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
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
                        className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors block line-clamp-1"
                      >
                        {service.name}
                      </Link>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{service.department || 'West Bengal'}</span>
                      </div>

                      {/* Checklist Progress Ring/Bar */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700">Checklist Ready:</span>
                          <span className={percent === 100 ? 'text-emerald-600 font-bold' : 'text-blue-600 font-bold'}>
                            {percent}% ({completedCount}/{totalDocs} Docs)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              percent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <Link
                        to={`/services/${service.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm"
                      >
                        <span>Checklist & Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {service.online_apply_url && (
                        <button
                          onClick={(e) => handleApplyClick(service, e)}
                          className="inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-blue-700 border border-slate-300 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-sm"
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
      )}

      {/* TAB CONTENT: RECENTLY VIEWED */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Recently Viewed Services
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem('sevasetu_recently_viewed');
                setRecentServices([]);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Clear history
            </button>
          </div>

          {recentServices.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">
                You haven't viewed any service guides in this session yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentServices.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category || 'Certificate'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {item.department || 'West Bengal'}
                    </p>
                  </div>
                  <Link
                    to={`/services/${item.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-2 border-t border-slate-100"
                  >
                    Open Guide <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Platform Updates & State Circulars
          </h2>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 pl-4">{n.desc}</p>
                </div>
                <span className="text-[11px] font-medium text-slate-400 shrink-0">
                  {n.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
