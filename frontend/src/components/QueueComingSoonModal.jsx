import React from 'react';
import { Clock, ShieldCheck, Sparkles, X, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const QueueComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-navy text-white p-5 border-b border-navy-700">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-saffron text-navy px-2 py-0.5 rounded">
                <Sparkles className="w-3 h-3 text-navy" /> Pilot Roadmap Feature
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                BSK Queue Status — Coming Soon
              </h3>
              <p className="text-xs text-slate-300">
                Ethical, verified crowd awareness under development
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-surface border border-slate-200 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider">
              <Clock className="w-4 h-4 text-saffron" />
              Our Commitment: Zero Fabricated Waiting Times
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike platforms that simulate artificial wait estimates or scrape unverified data, <strong>Seva Setu</strong> strictly publishes queue conditions only when supported by authorized on-site observers and verified administrative oversight.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              What We Are Building:
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indiaGreen shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy">Certified Field Observer Verification</p>
                  <p className="text-[11px] text-slate-500">Authorized field coordinators submit calibrated crowd levels (Low, Moderate, High).</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-digital shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy">30-Minute Automatic Staleness Safeguard</p>
                  <p className="text-[11px] text-slate-500">Expired observations degrade immediately to "Unknown" to protect citizens from outdated reports.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-navy px-3 py-2"
            >
              Close
            </button>
            <Link
              to="/queue"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-digital hover:bg-digital-600 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <span>Explore Queue Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueComingSoonModal;
