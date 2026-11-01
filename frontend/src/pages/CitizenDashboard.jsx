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
  CheckSquare,
  Settings
} from 'lucide-react';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'recent', 'notifications', 'profile'
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
      <div className="bg-navy text-white rounded-xl p-6 sm:p-8 border border-navy-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-saffron border border-white/20 font-black text-2xl">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'C')}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
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
              className="inline-flex items-center gap-2 bg-digital hover:bg-digital-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Browse All Services</span>
            </Link>
            <Link
              to="/centre"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors border border-white/20"
            >
              <MapPin className="w-4 h-4 text-saffron" />
              <span>Find BSK Centre</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-navy-700 max-w-xl text-xs">
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
            <span className="text-lg font-bold text-indiaGreen">100% Free</span>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'saved'
              ? 'bg-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Checklists ({savedServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'recent'
              ? 'bg-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recently Viewed ({recentServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'notifications'
              ? 'bg-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'bg-navy text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB CONTENT: SAVED SERVICES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-digital" />
              Bookmarked Services & Document Progress
            </h2>
            <span className="text-xs text-slate-500">
              Checklist state is saved locally on your device
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : savedServices.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-navy">
                No Saved Services Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Save services like Income Certificate, Caste Certificate, or Residence Certificate to easily track your required documents.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
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
                    className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-digital-50 text-digital border border-digital-200">
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
                        className="text-lg font-bold text-navy hover:text-digital transition-colors block line-clamp-1"
                      >
                        {service.name}
                      </Link>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{service.department || 'West Bengal'}</span>
                      </div>

                      {/* Checklist Progress Bar */}
                      <div className="bg-surface p-3 rounded-lg border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700">Checklist Ready:</span>
                          <span className={percent === 100 ? 'text-indiaGreen font-bold' : 'text-digital font-bold'}>
                            {percent}% ({completedCount}/{totalDocs} Docs)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              percent === 100 ? 'bg-indiaGreen' : 'bg-digital'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <Link
                        to={`/services/${service.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy hover:bg-navy-900 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                      >
                        <span>Checklist & Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {service.online_apply_url && (
                        <button
                          onClick={(e) => handleApplyClick(service, e)}
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
        </div>
      )}

      {/* TAB CONTENT: RECENTLY VIEWED */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Eye className="w-5 h-5 text-digital" />
              Recently Viewed Services
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem('sevasetu_recently_viewed');
                setRecentServices([]);
              }}
              className="text-xs text-slate-500 hover:text-navy underline"
            >
              Clear history
            </button>
          </div>

          {recentServices.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
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
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-digital transition-colors flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface text-slate-700">
                      {item.category || 'Certificate'}
                    </span>
                    <h3 className="text-base font-bold text-navy mt-2 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {item.department || 'West Bengal'}
                    </p>
                  </div>
                  <Link
                    to={`/services/${item.id}`}
                    className="text-xs font-bold text-digital hover:text-navy flex items-center gap-1 pt-2 border-t border-slate-100"
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
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <Bell className="w-5 h-5 text-digital" />
            Platform Updates & Notifications
          </h2>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white p-5 rounded-xl border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-saffron" />
                    <h3 className="font-bold text-sm text-navy">{n.title}</h3>
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

      {/* TAB CONTENT: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <Settings className="w-5 h-5 text-digital" />
            Citizen Profile Settings
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.full_name || user?.name || ''}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-surface text-navy font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-surface text-navy font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Citizen Role</label>
              <input
                type="text"
                disabled
                value={user?.role || 'Citizen'}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-surface text-navy font-medium uppercase"
              />
            </div>
          </div>

          <div className="p-3.5 bg-surface rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indiaGreen shrink-0" />
            <span>Citizen privacy guaranteed: Your account details are never shared with third parties.</span>
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
