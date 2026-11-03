import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Users,
  ShieldCheck,
  Sliders,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Send,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  Calendar,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { adminService, publicService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QueueBadge from '../components/QueueBadge';
import ConfirmModal from '../components/ConfirmModal';
import AdminSchemeManager from '../components/AdminSchemeManager';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Dashboard
  const [stats, setStats] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);

  // Data lists
  const [centres, setCentres] = useState([]);
  const [services, setServices] = useState([]);
  const [schemesCount, setSchemesCount] = useState(0);
  const [observations, setObservations] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [settings, setSettings] = useState({ stale_threshold_minutes: 30, allow_anonymous_observations: true });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Confirmation dialog state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  // Modals for Create/Edit
  const [centreModal, setCentreModal] = useState({ isOpen: false, data: null });
  const [serviceModal, setServiceModal] = useState({ isOpen: false, data: null });
  const [userModal, setUserModal] = useState({ isOpen: false, data: null });
  const [publishModal, setPublishModal] = useState({
    isOpen: false,
    centre_id: '',
    queue_status: 'MODERATE',
    source_type: 'OBSERVER_VERIFIED',
    source_description: 'Reviewed Field Observer Reports',
    supporting_observations: 2,
  });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [dashRes, centresRes, servicesRes, obsRes, histRes, auditRes, usersRes, setRes] = await Promise.all([
        adminService.getDashboard(),
        publicService.getCentres(),
        publicService.getAllServices(),
        adminService.getObservations(),
        adminService.getHistory(),
        adminService.getAuditLogs(),
        adminService.getUsers(),
        adminService.getSettings(),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
        setStatusDistribution(dashRes.data.status_distribution || []);
        setRecentUpdates(dashRes.data.recent_updates || []);
      }
      if (centresRes.data.success) setCentres(centresRes.data.centres);
      if (servicesRes.data.success) setServices(servicesRes.data.services);
      if (obsRes.data.success) setObservations(obsRes.data.observations);
      if (histRes.data.success) setHistoryList(histRes.data.history);
      if (auditRes.data.success) setAuditLogs(auditRes.data.logs);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (setRes.data.success) setSettings(setRes.data.settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showAlert('Failed to load dashboard data from backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ----------------- ACTION HANDLERS -----------------

  // Observations Review
  const handleReviewObs = async (obsId, decision) => {
    try {
      const res = await adminService.reviewObservation(obsId, { decision, review_notes: `Reviewed by ${user.name}` });
      if (res.data.success) {
        showAlert(`Observation marked as ${decision}.`);
        loadAllData();
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Review action failed.', 'error');
    }
  };

  // Publish Queue Status
  const handlePublishQueue = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.publishQueueUpdate({
        centre_id: parseInt(publishModal.centre_id, 10),
        queue_status: publishModal.queue_status,
        source_type: publishModal.source_type,
        source_description: publishModal.source_description,
        supporting_observations: parseInt(publishModal.supporting_observations, 10) || 0,
      });
      if (res.data.success) {
        showAlert('New queue status successfully published to public dashboard!');
        setPublishModal({ ...publishModal, isOpen: false });
        loadAllData();
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to publish queue update.', 'error');
    }
  };

  // Delete Centre
  const confirmDeleteCentre = (centre) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Centre "${centre.name}"?`,
      message: 'This will permanently remove the centre, all associated services, and queue logs from the database.',
      onConfirm: async () => {
        try {
          const res = await adminService.deleteCentre(centre.id);
          if (res.data.success) {
            showAlert(`Centre "${centre.name}" deleted.`);
            loadAllData();
          }
        } catch (err) {
          showAlert(err.response?.data?.message || 'Failed to delete centre.', 'error');
        }
      },
    });
  };

  // Delete Service
  const confirmDeleteService = (service) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Service "${service.name}"?`,
      message: 'Are you sure you want to delete this service record? Citizens will no longer see it on the portal.',
      onConfirm: async () => {
        try {
          const res = await adminService.deleteService(service.id);
          if (res.data.success) {
            showAlert(`Service "${service.name}" removed.`);
            loadAllData();
          }
        } catch (err) {
          showAlert(err.response?.data?.message || 'Failed to delete service.', 'error');
        }
      },
    });
  };

  // Save / Update Centre
  const handleSaveCentre = async (e) => {
    e.preventDefault();
    const data = centreModal.data;
    try {
      if (data.id) {
        await adminService.updateCentre(data.id, data);
        showAlert('Centre updated successfully.');
      } else {
        await adminService.createCentre(data);
        showAlert('New centre added to database.');
      }
      setCentreModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to save centre.', 'error');
    }
  };

  // Save / Update Service
  const handleSaveService = async (e) => {
    e.preventDefault();
    const data = serviceModal.data;
    try {
      if (data.id) {
        await adminService.updateService(data.id, data);
        showAlert('Service updated successfully.');
      } else {
        await adminService.createService(data);
        showAlert('New service created.');
      }
      setServiceModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to save service.', 'error');
    }
  };

  // Save / Create User
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const data = userModal.data;
    try {
      if (data.id) {
        await adminService.updateUser(data.id, data);
        showAlert('User account updated.');
      } else {
        await adminService.createUser(data);
        showAlert('New staff account created.');
      }
      setUserModal({ isOpen: false, data: null });
      loadAllData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to save user.', 'error');
    }
  };

  // Toggle user active
  const handleToggleUser = async (u) => {
    try {
      await adminService.updateUser(u.id, { is_active: !u.is_active });
      showAlert(`User account ${!u.is_active ? 'activated' : 'deactivated'}.`);
      loadAllData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to update user status.', 'error');
    }
  };

  // Save Platform Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateSettings(settings);
      if (res.data.success) {
        showAlert('Platform settings updated successfully.');
        loadAllData();
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to update settings.', 'error');
    }
  };

  const pendingObs = observations.filter(o => o.review_status === 'PENDING');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'schemes', label: 'Government Schemes', icon: Award, badge: schemesCount, badgeColor: 'bg-[#2878C8]' },
    { id: 'centres', label: 'Centre Management', icon: Building2, badge: centres.length },
    { id: 'services', label: 'Service Management', icon: FileText, badge: services.length },
    { id: 'queue', label: 'Queue Publishing', icon: Clock },
    { id: 'pending', label: 'Pending Observations', icon: CheckCircle2, badge: pendingObs.length, badgeColor: 'bg-amber-500' },
    { id: 'history', label: 'Update History', icon: History },
    { id: 'users', label: 'User Management', icon: Users, badge: usersList.length },
    { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  const STATUS_COLORS = {
    LOW: '#10b981',
    MODERATE: '#f59e0b',
    HIGH: '#ef4444',
    UNKNOWN: '#64748b'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Alert */}
      {alert.show && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg transition-all ${alert.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-emerald-600 text-white'
            }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert({ show: false, message: '', type: 'success' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-navy text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-navy-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
            <img
              src="/assets/brand/seva-setu-symbol.png"
              alt="Seva Setu Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-saffron text-navy text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                Administration Portal
              </span>
              <span className="text-xs text-slate-300">Bangla Sahayata Kendra Pilot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Seva Setu Operations & Governance
            </h1>
            <p className="text-xs text-slate-300">
              Signed in as <strong>{user?.name}</strong> ({user?.email}) • Administrator Privileges Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center justify-center">
            <img
              src="/assets/brand/seva-setu-logo.png"
              alt="Seva Setu Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-200 text-slate-700'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel (9 cols) */}
        <div className="lg:col-span-9">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Centres</p>
                  <p className="text-2xl font-black text-navy-900">{stats?.total_centres || centres.length}</p>
                  <p className="text-[11px] text-slate-500">Pilot locations in WB</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Services</p>
                  <p className="text-2xl font-black text-blue-700">{stats?.active_services || services.length}</p>
                  <p className="text-[11px] text-slate-500">Document checklists verified</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observations</p>
                  <p className="text-2xl font-black text-purple-700">{stats?.total_observations || observations.length}</p>
                  <p className="text-[11px] text-slate-500">{stats?.pending_observations || pendingObs.length} awaiting review</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Updates</p>
                  <p className="text-2xl font-black text-emerald-700">{stats?.published_updates || historyList.length}</p>
                  <p className="text-[11px] text-slate-500">Stale limit: {stats?.stale_threshold_minutes || 30}m</p>
                </div>
              </div>

              {/* Chart & Live Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status distribution bar chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-navy-900">Recent Observation Distribution</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusDistribution}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick actions & Pending Alert */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-navy-900">Operational Actions</h3>

                    {pendingObs.length > 0 ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <AlertTriangle className="w-5 h-5 text-amber-700" />
                          <div>
                            <p className="font-bold text-xs text-amber-900">{pendingObs.length} Observations Pending</p>
                            <p className="text-[11px] text-amber-700">Citizen & field reports need verification</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('pending')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
                        >
                          Review Now
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>All pending crowd submissions have been reviewed.</span>
                      </div>
                    )}

                    <div className="pt-2 space-y-2">
                      <button
                        onClick={() => {
                          setPublishModal({
                            isOpen: true,
                            centre_id: centres[0]?.id || '',
                            queue_status: 'MODERATE',
                            source_type: 'OBSERVER_VERIFIED',
                            source_description: 'Admin Observation Verification',
                            supporting_observations: 2,
                          });
                        }}
                        className="w-full py-2.5 px-4 bg-digital hover:bg-digital-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Clock className="w-4 h-4" /> Publish Live Queue Status
                      </button>

                      <button
                        onClick={() => {
                          setCentreModal({
                            isOpen: true,
                            data: {
                              name: '',
                              address: '',
                              district: 'South 24 Parganas (Sample)',
                              block: '',
                              opening_hours: '10:00 AM - 5:00 PM',
                              weekly_holidays: 'Sunday & Public Holidays',
                              official_source_url: 'https://bsk.wb.gov.in',
                              contact_details: '',
                            },
                          });
                        }}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add New BSK Centre
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Platform Mode: Independent Demo • SQLite Backend Active
                  </div>
                </div>
              </div>

              {/* Recent Published Updates Table */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-navy-900">Recent Published Queue Broadcasts</h3>
                  <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-blue-700 hover:underline">
                    View All History &rarr;
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Centre</th>
                        <th className="py-2.5 px-3">Published Status</th>
                        <th className="py-2.5 px-3">Evidence Source</th>
                        <th className="py-2.5 px-3">Supporting</th>
                        <th className="py-2.5 px-3">Published At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentUpdates.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{u.centre_name}</td>
                          <td className="py-2.5 px-3"><QueueBadge status={u.queue_status} size="sm" /></td>
                          <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{u.source_description}</td>
                          <td className="py-2.5 px-3 text-slate-700 font-semibold">{u.supporting_observations} obs</td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CENTRES */}
          {activeTab === 'centres' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">BSK Centre Management</h2>
                  <p className="text-xs text-slate-500">Create, edit, or remove pilot centres.</p>
                </div>
                <button
                  onClick={() => {
                    setCentreModal({
                      isOpen: true,
                      data: {
                        name: '',
                        address: '',
                        district: 'South 24 Parganas (Sample)',
                        block: '',
                        opening_hours: '10:00 AM - 5:00 PM',
                        weekly_holidays: 'Sunday & Public Holidays',
                        official_source_url: 'https://bsk.wb.gov.in',
                        contact_details: '',
                      },
                    });
                  }}
                  className="px-4 py-2 bg-digital hover:bg-digital-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Centre
                </button>
              </div>

              <div className="space-y-4">
                {centres.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-navy-900">{c.name}</h3>
                          <QueueBadge status={c.queue_summary?.status} isStale={c.queue_summary?.is_stale} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{c.address}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCentreModal({ isOpen: true, data: { ...c } })}
                          className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Centre"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDeleteCentre(c)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Centre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-400 block text-[10px] uppercase">District & Block</span>
                        <span className="font-semibold text-slate-800">{c.district} ({c.block})</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 block text-[10px] uppercase">Hours</span>
                        <span className="font-semibold text-slate-800">{c.opening_hours}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 block text-[10px] uppercase">Holidays</span>
                        <span className="font-semibold text-slate-800">{c.weekly_holidays}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 block text-[10px] uppercase">Services</span>
                        <span className="font-semibold text-slate-800">{c.service_count || 0} Listed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GOVERNMENT SCHEMES */}
          {activeTab === 'schemes' && (
            <AdminSchemeManager onSchemeUpdate={(count) => setSchemesCount(count)} />
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">Government Service Catalog</h2>
                  <p className="text-xs text-slate-500">Configure BSK service document requirements and official links.</p>
                </div>
                <button
                  onClick={() => {
                    setServiceModal({
                      isOpen: true,
                      data: {
                        centre_id: centres[0]?.id || '',
                        name: '',
                        category: 'Certificates & Revenue',
                        description: '',
                        required_documents: '1. Aadhaar Card\n2. Proof of Residence\n3. Passport Photograph',
                        official_source_url: 'https://bsk.wb.gov.in',
                      },
                    });
                  }}
                  className="px-4 py-2 bg-digital hover:bg-digital-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              <div className="space-y-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            {s.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Centre: {s.centre_name || 'Pilot Centre'}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-navy-900">{s.name}</h3>
                        <p className="text-xs text-slate-600 max-w-2xl">{s.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setServiceModal({ isOpen: true, data: { ...s, required_documents: s.raw_required_documents || (s.required_documents?.join('\n')) } })}
                          className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDeleteService(s)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {s.required_documents && s.required_documents.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-[10px] text-slate-400 uppercase block">Required Documents</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                          {s.required_documents.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUEUE PUBLISHING */}
          {activeTab === 'queue' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-navy-900">Publish Verified Queue Status</h2>
                <p className="text-xs text-slate-500">
                  Broadcasts official crowd status to the public platform. Updates are stamped with source attribution and undergo automatic 30-minute staleness tracking.
                </p>
              </div>

              <form onSubmit={handlePublishQueue} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select BSK Centre
                  </label>
                  <select
                    value={publishModal.centre_id || (centres[0]?.id || '')}
                    onChange={(e) => setPublishModal({ ...publishModal, centre_id: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Published Queue Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'LOW', label: 'LOW QUEUE', desc: '0 - 15 mins' },
                      { val: 'MODERATE', label: 'MODERATE', desc: '15 - 35 mins' },
                      { val: 'HIGH', label: 'HIGH QUEUE', desc: '35+ mins' },
                      { val: 'UNKNOWN', label: 'UNKNOWN / NO DATA', desc: 'Indeterminate' },
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.val}
                        onClick={() => setPublishModal({ ...publishModal, queue_status: st.val })}
                        className={`p-3 rounded-xl text-left border text-xs transition-all ${publishModal.queue_status === st.val
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500 shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <p>{st.label}</p>
                        <p className="text-[10px] text-slate-500 font-normal">{st.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Information Source Type
                  </label>
                  <select
                    value={publishModal.source_type}
                    onChange={(e) => setPublishModal({ ...publishModal, source_type: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OBSERVER_VERIFIED">OBSERVER_VERIFIED (Field Observer Verification)</option>
                    <option value="ADMIN_DIRECT">ADMIN_DIRECT (Coordinator On-site Inspection)</option>
                    <option value="COMMUNITY_CONSENSUS">COMMUNITY_CONSENSUS (Corroborated Citizen Reports)</option>
                    <option value="SAMPLE_DEMO">SAMPLE_DEMO (Pilot Simulation Metric)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Source Attribution Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={publishModal.source_description}
                    onChange={(e) => setPublishModal({ ...publishModal, source_description: e.target.value })}
                    placeholder="e.g. Reviewed 3 on-site observer logs between 10:15 AM - 10:45 AM"
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Citizens will see this exact attribution note next to the queue badge.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supporting Observations Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={publishModal.supporting_observations}
                    onChange={(e) => setPublishModal({ ...publishModal, supporting_observations: e.target.value })}
                    className="w-32 text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-digital hover:bg-digital-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Publish to Public Portal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: PENDING OBSERVATIONS */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">Observation Review Queue</h2>
                  <p className="text-xs text-slate-500">
                    Verify citizen and field submissions before they impact published queue estimates.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  {pendingObs.length} Awaiting Action
                </span>
              </div>

              {pendingObs.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">Review queue is clean</p>
                  <p className="text-xs">All submitted observations have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingObs.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <QueueBadge status={obs.queue_status} size="sm" />
                            <span className="text-xs font-bold text-navy-900">{obs.centre_name || 'Pilot Centre'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-600">
                              {obs.submission_source}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            By: <strong>{obs.observer_name}</strong> • Submitted: {new Date(obs.submitted_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewObs(obs.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewObs(obs.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>

                      {obs.waiting_range && (
                        <p className="text-xs text-slate-700">
                          Observed Waiting Time: <strong>{obs.waiting_range}</strong>
                        </p>
                      )}

                      {obs.notes && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                          "{obs.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-navy-900">Historical Queue Updates</h2>
                <p className="text-xs text-slate-500">Persistent log of all published queue statuses.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Update ID</th>
                      <th className="py-3 px-3">Centre</th>
                      <th className="py-3 px-3">Published Status</th>
                      <th className="py-3 px-3">Attribution Source</th>
                      <th className="py-3 px-3">Supporting Obs</th>
                      <th className="py-3 px-3">Published By</th>
                      <th className="py-3 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyList.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono text-slate-400">#{h.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{h.centre_name}</td>
                        <td className="py-3 px-3"><QueueBadge status={h.queue_status} size="sm" /></td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{h.source_description}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{h.supporting_observations}</td>
                        <td className="py-3 px-3 text-slate-600">{h.author_name}</td>
                        <td className="py-3 px-3 text-slate-400 font-mono">
                          {new Date(h.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">User & Observer Management</h2>
                  <p className="text-xs text-slate-500">Manage administrator and field observer accounts.</p>
                </div>
                <button
                  onClick={() => {
                    setUserModal({
                      isOpen: true,
                      data: { name: '', email: '', password: '', role: 'observer' },
                    });
                  }}
                  className="px-4 py-2 bg-digital hover:bg-digital-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Observer
                </button>
              </div>

              <div className="space-y-3">
                {usersList.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy-900">{u.name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {u.role}
                        </span>
                        {!u.is_active && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleUser(u)}
                        disabled={u.id === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${u.is_active
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          } disabled:opacity-30`}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-navy-900">Platform Audit Logs</h2>
                <p className="text-xs text-slate-500">Immutable trace of all administrative and security actions.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Entity</th>
                      <th className="py-2.5 px-3">Admin / User</th>
                      <th className="py-2.5 px-3">Details</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{log.action}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-semibold">{log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}</td>
                        <td className="py-2.5 px-3 text-slate-700">{log.user_name || 'System'}</td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate">{log.details}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-navy-900">Platform Pilot Configuration</h2>
                <p className="text-xs text-slate-500">Tune operational thresholds and citizen submission policies.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Queue Staleness Threshold (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.stale_threshold_minutes}
                    onChange={(e) => setSettings({ ...settings, stale_threshold_minutes: e.target.value })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Updates older than this value will be automatically flagged as "No Recent Update" for citizens.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Allow Anonymous Public Observations</p>
                      <p className="text-[11px] text-slate-500">Permits citizens without accounts to submit crowd reports.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allow_anonymous_observations}
                      onChange={(e) => setSettings({ ...settings, allow_anonymous_observations: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                >
                  Save Platform Settings
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Centre Create/Edit Modal */}
      {centreModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-navy text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {centreModal.data?.id ? 'Edit Centre Details' : 'Add New BSK Centre'}
              </h3>
              <button
                onClick={() => setCentreModal({ isOpen: false, data: null })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveCentre} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Centre Name</label>
                <input
                  type="text"
                  required
                  value={centreModal.data.name}
                  onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, name: e.target.value } })}
                  placeholder="e.g. Bangla Sahayata Kendra — Bhangar"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={centreModal.data.address}
                  onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, address: e.target.value } })}
                  placeholder="Full location address"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={centreModal.data.district}
                    onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, district: e.target.value } })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Block</label>
                  <input
                    type="text"
                    required
                    value={centreModal.data.block}
                    onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, block: e.target.value } })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operating Hours</label>
                  <input
                    type="text"
                    required
                    value={centreModal.data.opening_hours}
                    onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, opening_hours: e.target.value } })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Weekly Holidays</label>
                  <input
                    type="text"
                    required
                    value={centreModal.data.weekly_holidays}
                    onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, weekly_holidays: e.target.value } })}
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Details (Approved)</label>
                <input
                  type="text"
                  value={centreModal.data.contact_details || ''}
                  onChange={(e) => setCentreModal({ ...centreModal, data: { ...centreModal.data, contact_details: e.target.value } })}
                  placeholder="Official published contact only"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCentreModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-digital hover:bg-digital-600 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Save Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Create/Edit Modal */}
      {serviceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-navy text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {serviceModal.data?.id ? 'Edit Service' : 'Add Government Service'}
              </h3>
              <button
                onClick={() => setServiceModal({ isOpen: false, data: null })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveService} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Centre</label>
                <select
                  value={serviceModal.data.centre_id}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, centre_id: parseInt(e.target.value, 10) } })}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  required
                >
                  {centres.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.name}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, name: e.target.value } })}
                  placeholder="e.g. Caste Certificate Information"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.category}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, category: e.target.value } })}
                  placeholder="e.g. Certificates & Revenue, Food & Supplies"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={serviceModal.data.description}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, description: e.target.value } })}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Required Documents (One per line)
                </label>
                <textarea
                  rows={4}
                  value={serviceModal.data.required_documents || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, required_documents: e.target.value } })}
                  placeholder="1. Proof of Date of Birth&#10;2. Proof of Identity&#10;3. Residence Proof"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Source / Guideline URL</label>
                <input
                  type="url"
                  value={serviceModal.data.official_source_url || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, official_source_url: e.target.value } })}
                  placeholder="https://..."
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={serviceModal.data.department || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, department: e.target.value } })}
                  placeholder="e.g. Department of Personnel & Administrative Reforms"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fee</label>
                  <input
                    type="text"
                    value={serviceModal.data.fees || ''}
                    onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, fees: e.target.value } })}
                    placeholder="e.g. Free"
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Processing Time</label>
                  <input
                    type="text"
                    value={serviceModal.data.expected_processing_time || ''}
                    onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, expected_processing_time: e.target.value } })}
                    placeholder="e.g. 7 - 15 Days"
                    className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Direct Online Apply URL</label>
                <input
                  type="url"
                  value={serviceModal.data.online_apply_url || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, online_apply_url: e.target.value } })}
                  placeholder="https://edistrict.wb.gov.in/..."
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eligibility Criteria</label>
                <textarea
                  rows={2}
                  value={serviceModal.data.eligibility || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, eligibility: e.target.value } })}
                  placeholder="Resident of West Bengal, valid family income..."
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Offline Instructions (BSK / Office)</label>
                <textarea
                  rows={2}
                  value={serviceModal.data.offline_instructions || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, offline_instructions: e.target.value } })}
                  placeholder="Instructions for visiting BSK counters..."
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-digital hover:bg-digital-600 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Create Modal */}
      {userModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-navy text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-base">Add New Staff Account</h3>
              <button
                onClick={() => setUserModal({ isOpen: false, data: null })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userModal.data.name}
                  onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, name: e.target.value } })}
                  placeholder="Observer Name"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userModal.data.email}
                  onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, email: e.target.value } })}
                  placeholder="name@sevasetu.org"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={userModal.data.password}
                  onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, password: e.target.value } })}
                  placeholder="At least 6 characters"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role</label>
                <select
                  value={userModal.data.role}
                  onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, role: e.target.value } })}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="observer">Observer (Field Crowd Reporter)</option>
                  <option value="admin">Admin (Full Operations Access)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-digital hover:bg-digital-600 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

