import React from 'react';
import { Clock, ShieldCheck, Sparkles, X, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const QueueComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-blue-900 to-navy-900 text-white p-6 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-blue-400" /> Pilot Roadmap Feature
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                BSK Queue Tracking — Coming Soon
              </h3>
              <p className="text-xs text-slate-300">
                Ethical, verified crowd awareness under development
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-600" />
              Our Commitment: Zero Fabricated Waiting Times
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike platforms that simulate artificial wait estimates or scrape unverified data, <strong>Seva Setu</strong> strictly publishes queue conditions only when supported by authorized on-site observers and verified administrative oversight.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              What We Are Building:
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Permission-Based Observation Logs</p>
                  <p className="text-[11px] text-slate-500">Authorized field coordinators submit calibrated crowd levels (Low, Moderate, High).</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">30-Minute Automatic Staleness Filter</p>
                  <p className="text-[11px] text-slate-500">Expired observations degrade immediately to "Unknown" to protect citizens from outdated reports.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Transparent Source Attribution</p>
                  <p className="text-[11px] text-slate-500">Every published update clearly states its source timestamp and verification trail.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1">
            <p className="font-bold">Prepare Before You Visit Today:</p>
            <p className="text-[11px] leading-relaxed">
              You can already verify the required documents and opening hours for your nearest Bangla Sahayata Kendra in our service catalog.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <Link
              to="/centre"
              onClick={onClose}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" /> Find BSK Centre Address
            </Link>
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-colors shadow-sm"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueComingSoonModal;

