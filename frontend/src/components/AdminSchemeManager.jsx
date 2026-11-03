import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  History,
  CheckCircle2,
  Clock,
  Archive,
  Send,
  X,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Building2,
  Users,
  Check,
  ShieldCheck,
  HelpCircle,
  FileText
} from 'lucide-react';
import { adminService, schemeService } from '../services/api';
import ConfirmModal from './ConfirmModal';

const STATUS_CONFIG = {
  ALL: { label: 'All Schemes', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  PENDING_VERIFICATION: { label: 'Pending Verification', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  VERIFIED: { label: 'Verified', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
  PUBLISHED: { label: 'Published (Live)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  ARCHIVED: { label: 'Archived', color: 'bg-rose-50 text-rose-800 border-rose-300' },
};

const AdminSchemeManager = ({ onSchemeUpdate }) => {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    ALL: 0,
    DRAFT: 0,
    PENDING_VERIFICATION: 0,
    VERIFIED: 0,
    PUBLISHED: 0,
    ARCHIVED: 0
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [schemeModal, setSchemeModal] = useState({ isOpen: false, data: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, scheme: null });
  const [historyModal, setHistoryModal] = useState({ isOpen: false, scheme: null, history: [] });
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const loadSchemesData = async () => {
    setLoading(true);
    try {
      const params = { per_page: 100 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      if (categoryFilter) params.category_id = categoryFilter;

      const [schemesRes, catRes, deptRes] = await Promise.all([
        adminService.getSchemes(params),
        schemeService.getCategories(),
        schemeService.getDepartments()
      ]);

      if (schemesRes.data.success) {
        setSchemes(schemesRes.data.schemes);
        if (schemesRes.data.status_counts) {
          setStatusCounts(schemesRes.data.status_counts);
        }
      }
      if (catRes.data.success) setCategories(catRes.data.categories);
      if (deptRes.data.success) setDepartments(deptRes.data.departments);

      if (onSchemeUpdate) {
        onSchemeUpdate(schemesRes.data.schemes.length);
      }
    } catch (err) {
      console.error('Failed to load schemes for admin:', err);
      showAlert('Failed to load government schemes from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemesData();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSchemesData();
  };

  // Open Edit / Details Modal
  const openEditModal = async (schemeId) => {
    try {
      const res = await adminService.getScheme(schemeId);
      if (res.data.success) {
        const s = res.data.scheme;
        setSchemeModal({
          isOpen: true,
          data: {
            ...s,
            eligibility_rules: s.eligibility_rules || [],
            required_documents: s.required_documents || [],
            official_sources: s.official_sources || []
          }
        });
      }
    } catch (err) {
      showAlert('Failed to fetch full scheme details for editing.', 'error');
    }
  };

  // Open Preview Modal
  const openPreviewModal = async (schemeId) => {
    try {
      const res = await adminService.getScheme(schemeId);
      if (res.data.success) {
        setPreviewModal({
          isOpen: true,
          scheme: res.data.scheme
        });
      }
    } catch (err) {
      showAlert('Failed to load scheme preview.', 'error');
    }
  };

  // Open History Modal
  const openHistoryModal = async (scheme) => {
    try {
      const res = await adminService.getSchemeHistory(scheme.id);
      if (res.data.success) {
        setHistoryModal({
          isOpen: true,
          scheme,
          history: res.data.history
        });
      }
    } catch (err) {
      showAlert('Failed to load verification history.', 'error');
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setSchemeModal({
      isOpen: true,
      data: {
        name: '',
        slug: '',
        short_description: '',
        full_description: '',
        category_id: categories[0]?.id || 1,
        department_id: departments[0]?.id || '',
        beneficiary_summary: '',
        application_instructions: '',
        official_application_url: '',
        official_info_url: '',
        status: 'DRAFT',
        eligibility_rules: [
          { rule_type: 'AGE', rule_description: 'Age between 18 and 60 years.', minimum_age: 18, maximum_age: 60, is_mandatory: true }
        ],
        required_documents: [
          { document_name: 'Aadhaar Card', description: 'Proof of identity', is_mandatory: true }
        ],
        official_sources: [
          { source_title: 'Official Department Portal', source_url: 'https://wb.gov.in', source_type: 'OFFICIAL_PORTAL' }
        ]
      }
    });
  };

  // Save Scheme (Create or Update)
  const handleSaveScheme = async (e) => {
    e.preventDefault();
    const data = schemeModal.data;
    try {
      if (data.id) {
        await adminService.updateScheme(data.id, data);
        showAlert(`Scheme '${data.name}' updated successfully.`);
      } else {
        await adminService.createScheme(data);
        showAlert(`New scheme '${data.name}' created in DRAFT status.`);
      }
      setSchemeModal({ isOpen: false, data: null });
      loadSchemesData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to save scheme.', 'error');
    }
  };

  // Status transitions
  const handleStatusTransition = async (schemeId, action, schemeName) => {
    try {
      if (action === 'submit-verification') {
        await adminService.submitSchemeVerification(schemeId, { notes: 'Submitted by admin for official review' });
        showAlert(`Scheme '${schemeName}' submitted for verification.`);
      } else if (action === 'publish') {
        await adminService.publishScheme(schemeId, { notes: 'Approved and published to citizen directory' });
        showAlert(`Scheme '${schemeName}' is now LIVE and published to citizens!`);
      } else if (action === 'archive') {
        await adminService.archiveScheme(schemeId, { notes: 'Archived by admin' });
        showAlert(`Scheme '${schemeName}' has been archived.`);
      } else if (action === 'verify') {
        await adminService.updateSchemeStatus(schemeId, { status: 'VERIFIED', notes: 'Marked as verified by administrator' });
        showAlert(`Scheme '${schemeName}' marked as VERIFIED.`);
      } else if (action === 'draft') {
        await adminService.updateSchemeStatus(schemeId, { status: 'DRAFT', notes: 'Reverted to draft' });
        showAlert(`Scheme '${schemeName}' reverted to DRAFT.`);
      }
      loadSchemesData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to update status.', 'error');
    }
  };

  const confirmDeleteScheme = (scheme) => {
    setConfirmAction({
      isOpen: true,
      title: `Delete Scheme "${scheme.name}"?`,
      message: scheme.status === 'DRAFT'
        ? 'This will permanently delete this draft scheme and all its rules.'
        : 'This scheme is published or verified. It will be archived and removed from citizen view.',
      confirmText: scheme.status === 'DRAFT' ? 'Delete Draft' : 'Archive Scheme',
      onConfirm: async () => {
        try {
          const res = await adminService.deleteScheme(scheme.id);
          if (res.data.success) {
            showAlert(res.data.message || `Scheme "${scheme.name}" removed.`);
            loadSchemesData();
          }
        } catch (err) {
          showAlert(err.response?.data?.message || 'Failed to delete scheme.', 'error');
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Toast Alert */}
      {alert.show && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md transition-all ${
            alert.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert({ show: false, message: '', type: 'success' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2878C8]" />
            <h2 className="text-xl font-bold text-[#173B72]">Manage Government Schemes</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, verify, and publish official West Bengal welfare schemes with structured eligibility rules.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#173B72] hover:bg-[#2878C8] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const isSelected = statusFilter === key;
          const count = statusCounts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#173B72] text-white border-[#173B72] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{config.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes by name, keyword, or beneficiary..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2878C8]"
          />
        </form>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none text-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Schemes Listing Table */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#173B72] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading government schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-700">No schemes found in this status filter.</p>
          <p className="text-xs text-slate-500">Click "+ Add New Scheme" to add a new government welfare scheme.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Scheme Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Status & Verification</th>
                <th className="py-3 px-3">Last Verified</th>
                <th className="py-3 px-3 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemes.map((s) => {
                const statusStyle = STATUS_CONFIG[s.status]?.color || 'bg-slate-100 text-slate-700';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & Beneficiary */}
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="font-bold text-[#173B72] text-xs leading-snug truncate">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        /{s.slug}
                      </div>
                      {s.beneficiary_summary && (
                        <div className="text-[10px] text-slate-500 mt-1 truncate">
                          🎯 {s.beneficiary_summary}
                        </div>
                      )}
                    </td>

                    {/* Category & Department */}
                    <td className="py-3.5 px-3 max-w-[180px]">
                      <span className="font-semibold text-slate-700 block truncate">
                        {s.category_name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {s.department_name}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle}`}>
                        {s.status === 'PUBLISHED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {s.status === 'PENDING_VERIFICATION' && <Clock className="w-3 h-3 text-amber-600" />}
                        {s.status === 'ARCHIVED' && <Archive className="w-3 h-3 text-rose-600" />}
                        <span>{s.status}</span>
                      </span>
                    </td>

                    {/* Last Verified */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-[11px] text-slate-500">
                      {s.last_verified_at ? (
                        new Date(s.last_verified_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      ) : (
                        <span className="text-slate-400 italic">Unverified</span>
                      )}
                    </td>

                    {/* Workflow Actions */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1">
                      {/* Preview Button */}
                      <button
                        onClick={() => openPreviewModal(s.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#173B72] hover:bg-slate-100 transition-colors inline-block"
                        title="Preview Scheme Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(s.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#2878C8] hover:bg-slate-100 transition-colors inline-block"
                        title="Edit Scheme Information"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* History Log Button */}
                      <button
                        onClick={() => openHistoryModal(s)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors inline-block"
                        title="Verification History"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete / Archive Button */}
                      <button
                        onClick={() => confirmDeleteScheme(s)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-block"
                        title={s.status === 'DRAFT' ? 'Delete Draft Scheme' : 'Archive Scheme'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Workflow state buttons */}
                      {s.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusTransition(s.id, 'submit-verification', s.name)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Review</span>
                        </button>
                      )}

                      {s.status === 'PENDING_VERIFICATION' && (
                        <button
                          onClick={() => handleStatusTransition(s.id, 'publish', s.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Verify & Publish</span>
                        </button>
                      )}

                      {s.status === 'VERIFIED' && (
                        <button
                          onClick={() => handleStatusTransition(s.id, 'publish', s.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Publish</span>
                        </button>
                      )}

                      {s.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleStatusTransition(s.id, 'archive', s.name)}
                          className="px-2 py-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      )}

                      {s.status === 'ARCHIVED' && (
                        <button
                          onClick={() => handleStatusTransition(s.id, 'draft', s.name)}
                          className="px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-[10px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Restore</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT SCHEME MODAL */}
      {schemeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#173B72] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-saffron" />
                <h3 className="font-bold text-base">
                  {schemeModal.data?.id ? 'Edit Government Scheme' : 'Add New Government Scheme'}
                </h3>
              </div>
              <button
                onClick={() => setSchemeModal({ isOpen: false, data: null })}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheme} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Scheme Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schemeModal.data.name}
                    onChange={(e) => setSchemeModal({
                      ...schemeModal,
                      data: { ...schemeModal.data, name: e.target.value }
                    })}
                    placeholder="e.g. Lakshmir Bhandar Scheme"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={schemeModal.data.category_id}
                    onChange={(e) => setSchemeModal({
                      ...schemeModal,
                      data: { ...schemeModal.data, category_id: parseInt(e.target.value, 10) }
                    })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Department and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={schemeModal.data.department_id || ''}
                    onChange={(e) => setSchemeModal({
                      ...schemeModal,
                      data: { ...schemeModal.data, department_id: e.target.value ? parseInt(e.target.value, 10) : null }
                    })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={schemeModal.data.status || 'DRAFT'}
                    onChange={(e) => setSchemeModal({
                      ...schemeModal,
                      data: { ...schemeModal.data, status: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs bg-white"
                  >
                    <option value="DRAFT">DRAFT (Hidden from citizens)</option>
                    <option value="PENDING_VERIFICATION">PENDING_VERIFICATION (Under Review)</option>
                    <option value="VERIFIED">VERIFIED (Reviewed by admin)</option>
                    <option value="PUBLISHED">PUBLISHED (Live on Citizen Portal)</option>
                    <option value="ARCHIVED">ARCHIVED (Outdated/Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Beneficiary Summary */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Beneficiary Summary
                </label>
                <input
                  type="text"
                  value={schemeModal.data.beneficiary_summary || ''}
                  onChange={(e) => setSchemeModal({
                    ...schemeModal,
                    data: { ...schemeModal.data, beneficiary_summary: e.target.value }
                  })}
                  placeholder="e.g. Female heads of household aged 25 to 60 residing in West Bengal"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Description (Cards & Listing) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={schemeModal.data.short_description || ''}
                  onChange={(e) => setSchemeModal({
                    ...schemeModal,
                    data: { ...schemeModal.data, short_description: e.target.value }
                  })}
                  placeholder="Brief summary shown on cards..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={schemeModal.data.full_description || ''}
                  onChange={(e) => setSchemeModal({
                    ...schemeModal,
                    data: { ...schemeModal.data, full_description: e.target.value }
                  })}
                  placeholder="Complete scheme overview, background, benefit scale..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              {/* Application Instructions */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Application Instructions (Step-by-step)
                </label>
                <textarea
                  rows={3}
                  value={schemeModal.data.application_instructions || ''}
                  onChange={(e) => setSchemeModal({
                    ...schemeModal,
                    data: { ...schemeModal.data, application_instructions: e.target.value }
                  })}
                  placeholder="Step 1: ...&#10;Step 2: ..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Apply URL
                  </label>
                  <input
                    type="url"
                    value={schemeModal.data.official_application_url || ''}
                    onChange={(e) => setSchemeModal({
                      ...schemeModal,
                      data: { ...schemeModal.data, official_application_url: e.target.value }
                    })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Information Portal URL
                  </label>
                  <input
                    type="url"
                    value={schemeModal.data.official_info_url || ''}
                    onChange={(e) => setSchemeModal({
                      ...schemeModal,
                      data: { ...schemeModal.data, official_info_url: e.target.value }
                    })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSchemeModal({ isOpen: false, data: null })}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173B72] hover:bg-[#2878C8] text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  {schemeModal.data?.id ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEME PREVIEW MODAL */}
      {previewModal.isOpen && previewModal.scheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-[#173B72] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-saffron" />
                <h3 className="font-bold text-base">Citizen View Live Preview</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">
                  Status: {previewModal.scheme.status}
                </span>
              </div>
              <button
                onClick={() => setPreviewModal({ isOpen: false, scheme: null })}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#173B72] bg-[#EAF2FC] px-2.5 py-0.5 rounded-full uppercase">
                  {previewModal.scheme.category_name}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#173B72]">
                  {previewModal.scheme.name}
                </h1>
                <p className="text-slate-500 font-semibold">
                  {previewModal.scheme.department_name}
                </p>
                <p className="text-slate-700 pt-1 leading-relaxed">
                  {previewModal.scheme.short_description}
                </p>
              </div>

              {previewModal.scheme.beneficiary_summary && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                  <Users className="w-4 h-4 text-[#2878C8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">Beneficiaries</span>
                    <span className="font-semibold text-slate-800">{previewModal.scheme.beneficiary_summary}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-bold text-[#173B72] text-sm">Full Description</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {previewModal.scheme.full_description}
                </p>
              </div>

              {previewModal.scheme.eligibility_rules?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#173B72] text-sm">Eligibility Rules</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {previewModal.scheme.eligibility_rules.map((r, i) => (
                      <li key={i}>
                        <strong>[{r.rule_type}]</strong> {r.rule_description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {previewModal.scheme.required_documents?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#173B72] text-sm">Required Documents</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {previewModal.scheme.required_documents.map((d, i) => (
                      <li key={i}>{d.document_name} {d.description && `(${d.description})`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Slug: <code>/schemes/{previewModal.scheme.slug}</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModal({ isOpen: false, scheme: null })}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close Preview
                </button>
                {previewModal.scheme.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => {
                      const s = previewModal.scheme;
                      setPreviewModal({ isOpen: false, scheme: null });
                      handleStatusTransition(s.id, 'publish', s.name);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Directly to Citizens</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION HISTORY MODAL */}
      {historyModal.isOpen && historyModal.scheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#173B72] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-saffron" />
                <div>
                  <h3 className="font-bold text-sm">Verification History Log</h3>
                  <p className="text-[11px] text-slate-300 truncate max-w-xs">{historyModal.scheme.name}</p>
                </div>
              </div>
              <button
                onClick={() => setHistoryModal({ isOpen: false, scheme: null, history: [] })}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {historyModal.history.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No audit transitions recorded yet.</p>
              ) : (
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {historyModal.history.map((h, i) => (
                    <div key={h.id || i} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-[#173B72] text-white flex items-center justify-center shrink-0 z-10 text-[10px] font-bold">
                        {i + 1}
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex-1 text-xs space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#173B72]">
                            {h.previous_status} → <span className="text-emerald-700">{h.new_status}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {h.created_at ? new Date(h.created_at).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{h.notes}</p>
                        <p className="text-[10px] text-slate-400">By: {h.admin_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setHistoryModal({ isOpen: false, scheme: null, history: [] })}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmAction.isOpen}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText={confirmAction.confirmText || 'Delete'}
        onConfirm={confirmAction.onConfirm}
        onClose={() => setConfirmAction({ ...confirmAction, isOpen: false })}
      />
    </div>
  );
};

export default AdminSchemeManager;

