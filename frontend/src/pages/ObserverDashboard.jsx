import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldAlert, 
  History,
  Building2,
  Info
} from 'lucide-react';
import { observerService, publicService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QueueBadge from '../components/QueueBadge';

const ObserverDashboard = () => {
  const { user } = useAuth();
  const [centres, setCentres] = useState([]);
  const [myObservations, setMyObservations] = useState([]);
  const [centreId, setCentreId] = useState('');
  const [queueStatus, setQueueStatus] = useState('MODERATE');
  const [waitingRange, setWaitingRange] = useState('15 - 25 mins');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [centresRes, obsRes] = await Promise.all([
        publicService.getCentres(),
        observerService.getMyObservations(),
      ]);
      if (centresRes.data.success && centresRes.data.centres.length > 0) {
        setCentres(centresRes.data.centres);
        if (!centreId) setCentreId(centresRes.data.centres[0].id);
      }
      if (obsRes.data.success) {
        setMyObservations(obsRes.data.observations);
      }
    } catch (err) {
      console.error('Failed to load observer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!centreId) {
      setMessage({ text: 'Please select a centre.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await observerService.submitObservation({
        centre_id: parseInt(centreId, 10),
        queue_status: queueStatus,
        waiting_range: waitingRange,
        notes: notes.trim(),
      });

      if (res.data.success) {
        setMessage({
          text: 'Observation logged! It is now pending administrator review.',
          type: 'success',
        });
        setNotes('');
        loadData();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Submission failed.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getReviewStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-navy text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-navy-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-saffron text-navy text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
              Field Observer Portal
            </span>
            <span className="text-xs text-slate-300">Independent Pilot Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Observer Dashboard — {user?.name}
          </h1>
          <p className="text-xs text-slate-300">
            Submit verified on-site crowd observations. All submissions require administrator sign-off before publication.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-xs shrink-0">
          <p className="text-slate-300">Total Submissions</p>
          <p className="text-xl font-bold text-white">{myObservations.length}</p>
        </div>
      </div>

      {/* Main Grid: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submission Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <UserCheck className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold text-navy-900">Log New Queue Observation</h2>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BSK Service Centre
                </label>
                <select
                  value={centreId}
                  onChange={(e) => setCentreId(e.target.value)}
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
                  Observed Crowd Volume
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'LOW', label: 'LOW', desc: '0 - 15 mins' },
                    { val: 'MODERATE', label: 'MODERATE', desc: '15 - 35 mins' },
                    { val: 'HIGH', label: 'HIGH', desc: '35+ mins' },
                    { val: 'UNKNOWN', label: 'UNKNOWN', desc: 'Indeterminate' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.val}
                      onClick={() => setQueueStatus(s.val)}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        queueStatus === s.val
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p>{s.label}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Observed Wait Range (Approx.)
                </label>
                <input
                  type="text"
                  value={waitingRange}
                  onChange={(e) => setWaitingRange(e.target.value)}
                  placeholder="e.g. 15 - 25 mins or Under 10 mins"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Observation Field Notes (No Citizen PII)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 12 people waiting in certificate line, 4 at ration desk. All staff present."
                  className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Do not write names, mobile numbers, or token IDs.
                </p>
              </div>

              {/* Protocol Warning */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  Review Protocol:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Observers cannot directly publish queue status to the public dashboard. Your report will be reviewed by the administrator alongside other corroborating sources.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-lg bg-digital hover:bg-digital-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit for Admin Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Observation History (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h2 className="text-base font-bold text-navy-900">Your Submission History</h2>
              </div>
              <span className="text-xs text-slate-400">
                {myObservations.length} entries recorded
              </span>
            </div>

            {myObservations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No observations recorded yet.</p>
                <p className="text-[11px]">Submit your first queue log using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {myObservations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <QueueBadge status={obs.queue_status} size="sm" />
                        <span className="text-xs font-bold text-slate-800">
                          {obs.centre_name || 'Pilot Centre'}
                        </span>
                      </div>
                      <div>{getReviewStatusBadge(obs.review_status)}</div>
                    </div>

                    {obs.waiting_range && (
                      <p className="text-xs text-slate-600">
                        Observed Range: <strong className="text-slate-800">{obs.waiting_range}</strong>
                      </p>
                    )}

                    {obs.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{obs.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Submitted: {obs.submitted_at ? new Date(obs.submitted_at).toLocaleString() : 'Recent'}</span>
                      {obs.reviewed_by && (
                        <span className="text-slate-600">
                          Reviewed by {obs.reviewer_name || 'Admin'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObserverDashboard;

