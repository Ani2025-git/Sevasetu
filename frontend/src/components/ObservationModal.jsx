import React, { useState, useEffect } from 'react';
import { X, Send, AlertTriangle, ShieldCheck, Clock, Info } from 'lucide-react';
import { publicService, observerService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ObservationModal = ({ isOpen, onClose, defaultCentreId, centres = [], onSuccess }) => {
  const { isAuthenticated, isObserver } = useAuth();
  const [centreId, setCentreId] = useState(defaultCentreId || '');
  const [queueStatus, setQueueStatus] = useState('MODERATE');
  const [waitingRange, setWaitingRange] = useState('15 - 25 mins');
  const [notes, setNotes] = useState('');
  const [piiWarning, setPiiWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (defaultCentreId) {
      setCentreId(defaultCentreId);
    } else if (centres.length > 0 && !centreId) {
      setCentreId(centres[0].id);
    }
  }, [defaultCentreId, centres]);

  if (!isOpen) return null;

  // Realtime PII validator
  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    const phoneRegex = /\b(?:\+91|0)?[6-9]\d{9}\b/;
    const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;

    if (phoneRegex.test(val)) {
      setPiiWarning('Notes appear to contain a phone number. Please remove personal contact numbers.');
    } else if (aadhaarRegex.test(val)) {
      setPiiWarning('Notes appear to contain an Aadhaar/ID number. Never submit citizen identity numbers.');
    } else {
      setPiiWarning('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!centreId) {
      setError('Please select a centre.');
      return;
    }
    if (piiWarning) {
      setError('Please remove personal identifiable information before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        centre_id: parseInt(centreId, 10),
        queue_status: queueStatus,
        waiting_range: waitingRange,
        notes: notes.trim(),
      };

      let res;
      if (isAuthenticated && isObserver) {
        res = await observerService.submitObservation(payload);
      } else {
        res = await publicService.submitAnonymousObservation(payload);
      }

      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Observation submitted successfully!');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
          setNotes('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit observation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">Report Queue Observation</h3>
              <p className="text-xs text-slate-300">
                {isAuthenticated ? 'Submitting as Registered Observer' : 'Submitting as Anonymous Citizen'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Centre Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Service Centre <span className="text-rose-500">*</span>
            </label>
            <select
              value={centreId}
              onChange={(e) => setCentreId(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Centre...</option>
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district})
                </option>
              ))}
            </select>
          </div>

          {/* Queue Status Radio Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Observed Queue Volume <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 'LOW', label: 'Low Queue', desc: '0 - 15 mins wait', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' },
                { val: 'MODERATE', label: 'Moderate', desc: '15 - 35 mins wait', color: 'border-amber-400 bg-amber-50 text-amber-800' },
                { val: 'HIGH', label: 'High Queue', desc: '35+ mins wait', color: 'border-rose-400 bg-rose-50 text-rose-800' },
                { val: 'UNKNOWN', label: 'Uncertain', desc: 'Unable to gauge', color: 'border-slate-300 bg-slate-50 text-slate-700' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setQueueStatus(opt.val)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    queueStatus === opt.val
                      ? `${opt.color} ring-2 ring-blue-500 font-semibold shadow-sm`
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[11px] opacity-75">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Approximate Waiting Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Observed Waiting Range (Optional)
            </label>
            <input
              type="text"
              value={waitingRange}
              onChange={(e) => setWaitingRange(e.target.value)}
              placeholder="e.g. 10 - 20 mins or 45 mins"
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Observation Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Observation Notes (No Personal Info)
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Non-PII only</span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={handleNotesChange}
              placeholder="e.g. Counter 1 is processing caste certificates quickly. Token machine functioning."
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {piiWarning ? (
              <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {piiWarning}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Never include citizen names, phone numbers, Aadhaar or token slips.
              </p>
            )}
          </div>

          {/* Verification Protocol Notice */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Quality Assurance:</strong> Observations are verified by the pilot administrator before inclusion in the published queue estimate. Single reports do not automatically change the status.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !!piiWarning}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit Observation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObservationModal;

