import React, { useState, useEffect } from 'react';
import {
  Power,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Eye,
  Save,
  RefreshCw,
  Mail,
  ShieldAlert,
  User,
  History,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../services/api';
import { useWebsiteStatus } from '../context/WebsiteStatusContext';

const AdminWebsiteControl = () => {
  const { isMaintenanceMode, maintenanceData, refreshStatus, setDirectStatus } = useWebsiteStatus();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    is_maintenance_mode: false,
    maintenance_title_en: '',
    maintenance_title_bn: '',
    maintenance_title_hi: '',
    maintenance_message_en: '',
    maintenance_message_bn: '',
    maintenance_message_hi: '',
    estimated_reopening_at: '',
    support_contact_email: '',
  });

  const [lastUpdated, setLastUpdated] = useState({
    updated_at: null,
    updated_by_name: null,
  });

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);
  const [changeReason, setChangeReason] = useState('');

  // Live preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLang, setPreviewLang] = useState('en');

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Load current settings from backend
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getWebsiteSettings();
      if (res.data && res.data.success) {
        const data = res.data.settings;
        setFormData({
          is_maintenance_mode: Boolean(data.is_maintenance_mode),
          maintenance_title_en: data.maintenance_title_en || '',
          maintenance_title_bn: data.maintenance_title_bn || '',
          maintenance_title_hi: data.maintenance_title_hi || '',
          maintenance_message_en: data.maintenance_message_en || '',
          maintenance_message_bn: data.maintenance_message_bn || '',
          maintenance_message_hi: data.maintenance_message_hi || '',
          estimated_reopening_at: data.estimated_reopening_at
            ? new Date(data.estimated_reopening_at).toISOString().slice(0, 16)
            : '',
          support_contact_email: data.support_contact_email || 'support@sevasetu.org',
        });
        setLastUpdated({
          updated_at: data.updated_at,
          updated_by_name: data.updated_by_name || 'System Admin',
        });
        setDirectStatus(data);
      }
    } catch (err) {
      console.error('Error fetching website settings:', err);
      if (err.response?.status === 404) {
        setError('Backend deployment pending: Render has not finished deploying the latest commit (7c742f6). Please trigger "Manual Deploy -> Deploy latest commit" on dashboard.render.com if auto-deploy is not enabled.');
      } else {
        setError('Unable to load current website availability settings from backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load audit logs
  const loadAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await adminService.getAuditLogs();
      if (res.data && res.data.audit_logs) {
        // Filter for website status change actions
        const statusLogs = res.data.audit_logs.filter(
          (log) => log.action === 'WEBSITE_STATUS_CHANGE' || log.action?.includes('WEBSITE')
        );
        setAuditLogs(statusLogs);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadSettings();
    loadAuditLogs();
  }, []);

  // Handle direct text changes in message editor
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save non-status configuration (messages, reopening time, email)
  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const payload = {
        ...formData,
        estimated_reopening_at: formData.estimated_reopening_at
          ? new Date(formData.estimated_reopening_at).toISOString()
          : null,
        reason: 'Updated maintenance messages and schedule configuration',
      };

      const res = await adminService.updateWebsiteSettings(payload);
      if (res.data && res.data.success) {
        setSuccessMsg('Website configuration and maintenance messages saved successfully.');
        setLastUpdated({
          updated_at: res.data.settings.updated_at,
          updated_by_name: res.data.settings.updated_by_name || 'You',
        });
        setDirectStatus(res.data.settings);
        refreshStatus();
        loadAuditLogs();
      }
    } catch (err) {
      console.error('Error saving website configuration:', err);
      if (err.response?.status === 404) {
        setError('Backend deployment pending: Render is still compiling the new API routes. Please trigger "Manual Deploy -> Deploy latest commit" on dashboard.render.com.');
      } else {
        setError(err.response?.data?.message || 'Failed to save website configuration.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Trigger toggle flow with confirmation modal
  const handleToggleClick = () => {
    const nextStatus = !formData.is_maintenance_mode;
    setPendingStatus(nextStatus);
    setChangeReason(
      nextStatus
        ? 'Scheduled system update and database maintenance'
        : 'Maintenance completed, restoring public services'
    );
    setShowConfirmModal(true);
  };

  // Confirm status change
  const handleConfirmToggle = async () => {
    try {
      setSaving(true);
      setError(null);
      setShowConfirmModal(false);

      const payload = {
        ...formData,
        is_maintenance_mode: pendingStatus,
        estimated_reopening_at: formData.estimated_reopening_at
          ? new Date(formData.estimated_reopening_at).toISOString()
          : null,
        reason: changeReason.trim() || (pendingStatus ? 'Enabled Maintenance Mode' : 'Restored Public Website Access'),
      };

      const res = await adminService.updateWebsiteSettings(payload);
      if (res.data && res.data.success) {
        setFormData((prev) => ({ ...prev, is_maintenance_mode: pendingStatus }));
        setLastUpdated({
          updated_at: res.data.settings.updated_at,
          updated_by_name: res.data.settings.updated_by_name || 'You',
        });
        setDirectStatus(res.data.settings);
        refreshStatus();
        loadAuditLogs();
        setSuccessMsg(
          pendingStatus
            ? '⚠️ MAINTENANCE MODE ACTIVATED: Public visitors are now seeing the maintenance page.'
            : '✅ WEBSITE IS ONLINE: Normal public access has been successfully restored.'
        );
      }
    } catch (err) {
      console.error('Error changing website status:', err);
      if (err.response?.status === 404) {
        setError('Backend deployment pending: Render has not yet deployed the new website-settings endpoints. Please go to dashboard.render.com and trigger "Manual Deploy -> Deploy latest commit".');
      } else {
        setError(err.response?.data?.message || 'Failed to change website status.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 text-[#173B72] animate-spin" />
        <span className="ml-3 text-sm font-semibold text-slate-600">
          Loading website availability control...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Power className="w-6 h-6 text-[#173B72]" />
            <h2 className="text-xl font-bold text-[#173B72]">Website Availability Control</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage public availability, trigger maintenance mode, edit citizen messages, and audit status changes.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Master Availability Status Card */}
      <div
        className={`rounded-2xl border-2 p-6 transition-all shadow-sm ${
          formData.is_maintenance_mode
            ? 'bg-rose-50/60 border-rose-300'
            : 'bg-emerald-50/60 border-emerald-300'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  formData.is_maintenance_mode
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {formData.is_maintenance_mode ? 'Website Offline / Maintenance' : 'Website Online / Active'}
              </span>

              <span className="text-xs font-semibold text-slate-500">
                Mode: {formData.is_maintenance_mode ? 'MAINTENANCE (503)' : 'PUBLIC (200 OK)'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {formData.is_maintenance_mode
                ? 'Public Website is Currently BLOCKED'
                : 'Public Website is Operating Normally'}
            </h3>

            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {formData.is_maintenance_mode
                ? 'All citizen routes (Home, Schemes, Services, BSK Centres) show the branded Maintenance Page. Public API requests return HTTP 503. Only authenticated Administrators can bypass this screen.'
                : 'All citizen visitors have full unrestricted access to services, verified welfare schemes, queue status, and BSK centres.'}
            </p>

            {lastUpdated.updated_at && (
              <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-2">
                <span>
                  Last changed:{' '}
                  <strong>
                    {new Date(lastUpdated.updated_at).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Admin: <strong>{lastUpdated.updated_by_name}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Large Action Toggle Button */}
          <div className="shrink-0 flex flex-col items-end gap-2 w-full md:w-auto">
            <button
              onClick={handleToggleClick}
              disabled={saving}
              className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2.5 ${
                formData.is_maintenance_mode
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>
                {formData.is_maintenance_mode ? 'RESTORE PUBLIC ACCESS (TURN ON)' : 'TURN OFF WEBSITE (MAINTENANCE)'}
              </span>
            </button>
            <span className="text-[11px] text-slate-500 text-center md:text-right">
              Requires confirmation & audit log note
            </span>
          </div>
        </div>
      </div>

      {/* Maintenance Configuration & Message Editor */}
      <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#173B72] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2878C8]" />
              <span>Multilingual Maintenance Message Editor</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the messages shown to citizens during maintenance in Bengali, English, and Hindi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#173B72] bg-[#EAF2FC] hover:bg-[#d6e7fa] rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Citizen Preview</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#173B72] hover:bg-[#2878C8] rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* English */}
        <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              English Announcement (Default)
            </label>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Primary Language
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Title</label>
              <input
                type="text"
                value={formData.maintenance_title_en}
                onChange={(e) => handleInputChange('maintenance_title_en', e.target.value)}
                placeholder="We'll Be Back Soon"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Message Body</label>
              <textarea
                rows={2}
                value={formData.maintenance_message_en}
                onChange={(e) => handleInputChange('maintenance_message_en', e.target.value)}
                placeholder="Seva Setu is temporarily unavailable while we carry out scheduled system maintenance..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>
          </div>
        </div>

        {/* Bengali */}
        <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#173B72] uppercase tracking-wide">
              বাংলা বার্তা (Bengali)
            </label>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Regional Language
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">শিরোনাম (Title)</label>
              <input
                type="text"
                value={formData.maintenance_title_bn}
                onChange={(e) => handleInputChange('maintenance_title_bn', e.target.value)}
                placeholder="আমরা শীঘ্রই ফিরে আসব"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">বার্তা (Message)</label>
              <textarea
                rows={2}
                value={formData.maintenance_message_bn}
                onChange={(e) => handleInputChange('maintenance_message_bn', e.target.value)}
                placeholder="তফসিলি রক্ষণাবেক্ষণের জন্য সেবা সেতু সাময়িকভাবে অনুপলব্ধ রয়েছে..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>
          </div>
        </div>

        {/* Hindi */}
        <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              हिन्दी संदेश (Hindi)
            </label>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              National Language
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">शीर्षक (Title)</label>
              <input
                type="text"
                value={formData.maintenance_title_hi}
                onChange={(e) => handleInputChange('maintenance_title_hi', e.target.value)}
                placeholder="हम जल्द ही वापस आएंगे"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">संदेश (Message)</label>
              <textarea
                rows={2}
                value={formData.maintenance_message_hi}
                onChange={(e) => handleInputChange('maintenance_message_hi', e.target.value)}
                placeholder="अनुसूचित रखरखाव के कारण सेवा सेतु अस्थायी रूप से अनुपलब्ध है..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2878C8]" />
              <span>Estimated Reopening Time (Optional)</span>
            </label>
            <input
              type="datetime-local"
              value={formData.estimated_reopening_at}
              onChange={(e) => handleInputChange('estimated_reopening_at', e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              If set, citizens see a live countdown clock on the maintenance page.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2878C8]" />
              <span>Support Contact Email</span>
            </label>
            <input
              type="email"
              value={formData.support_contact_email}
              onChange={(e) => handleInputChange('support_contact_email', e.target.value)}
              placeholder="support@sevasetu.org"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displayed on the maintenance page for urgent citizen inquiries.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#173B72] hover:bg-[#2878C8] rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#173B72]" />
            <h3 className="text-base font-bold text-[#173B72]">Status Change Audit History</h3>
          </div>
          <button
            onClick={loadAuditLogs}
            className="text-xs text-[#2878C8] hover:underline font-semibold"
          >
            Refresh Logs
          </button>
        </div>

        {loadingLogs ? (
          <p className="text-xs text-slate-500 py-4">Loading audit entries...</p>
        ) : auditLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No website status change events recorded yet. Every toggle will be tracked here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Timestamp</th>
                  <th className="px-3 py-2.5">Admin</th>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-slate-800 font-semibold">
                      {log.user_email || log.user_name || 'Admin'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.action?.includes('OFF') || log.action?.includes('MAINTENANCE')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 max-w-xs truncate">
                      {log.details || log.reason || 'Status updated by administrator'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  pendingStatus ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {pendingStatus ? 'Enable Maintenance Mode?' : 'Restore Public Website Access?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {pendingStatus
                    ? 'Public visitors will immediately see the Maintenance Page.'
                    : 'Public visitors will immediately regain full access to Seva Setu.'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reason / Change Note (Mandatory)</label>
              <textarea
                rows={2}
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain the reason for changing website availability..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#173B72]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                disabled={saving || !changeReason.trim()}
                className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-colors ${
                  pendingStatus
                    ? 'bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300'
                }`}
              >
                {saving ? 'Applying...' : pendingStatus ? 'Yes, Turn Website OFF' : 'Yes, Restore Access (ON)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#173B72]" />
                <h3 className="text-base font-bold text-[#173B72]">Maintenance Page Live Preview</h3>
              </div>

              {/* Preview Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewLang('bn')}
                  className={`px-2 py-0.5 rounded ${previewLang === 'bn' ? 'bg-[#173B72] text-white' : 'text-slate-600'}`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`px-2 py-0.5 rounded ${previewLang === 'en' ? 'bg-[#173B72] text-white' : 'text-slate-600'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('hi')}
                  className={`px-2 py-0.5 rounded ${previewLang === 'hi' ? 'bg-[#173B72] text-white' : 'text-slate-600'}`}
                >
                  हिन्दी
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Maintenance Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Power className="w-7 h-7" />
              </div>

              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                Scheduled Maintenance
              </span>

              <h2 className="text-xl font-bold text-[#173B72]">
                {previewLang === 'bn'
                  ? formData.maintenance_title_bn || 'আমরা শীঘ্রই ফিরে আসব'
                  : previewLang === 'hi'
                  ? formData.maintenance_title_hi || 'हम जल्द ही वापस आएंगे'
                  : formData.maintenance_title_en || "We'll Be Back Soon"}
              </h2>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {previewLang === 'bn'
                  ? formData.maintenance_message_bn ||
                    'তফসিলি রক্ষণাবেক্ষণের জন্য সেবা সেতু সাময়িকভাবে অনুপলব্ধ রয়েছে...'
                  : previewLang === 'hi'
                  ? formData.maintenance_message_hi ||
                    'अनुसूचित रखरखाव के कारण सेवा सेतु अस्थायी रूप से अनुपलब्ध है...'
                  : formData.maintenance_message_en ||
                    'Seva Setu is temporarily unavailable while we carry out scheduled system maintenance...'}
              </p>

              {formData.estimated_reopening_at && (
                <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 inline-block text-slate-700">
                  <span className="text-slate-500 font-semibold">Estimated Reopening: </span>
                  <span className="font-bold">
                    {new Date(formData.estimated_reopening_at).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-2">
                Support inquiries:{' '}
                <span className="font-semibold text-[#2878C8]">{formData.support_contact_email}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteControl;

