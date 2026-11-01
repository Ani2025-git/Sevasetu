import React from 'react';
import { ExternalLink, ShieldAlert, ArrowRight, X } from 'lucide-react';

const ExternalRedirectModal = ({ isOpen, onClose, targetUrl, serviceName }) => {
  if (!isOpen || !targetUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">External Government Portal Notice</h3>
              <p className="text-xs text-slate-300 mt-0.5">Official State Application Link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-950">
            <p className="font-bold text-sm text-amber-900">
              You are now leaving Seva Setu
            </p>
            <p className="leading-relaxed">
              You are being redirected to the official government portal for <strong>{serviceName || 'this service'}</strong>:
            </p>
            <p className="font-mono text-blue-700 bg-white p-2 rounded-lg border border-amber-200 truncate mt-1">
              {targetUrl}
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Official Application:</strong> Seva Setu provides informational document guidance only. Official applications and payments must be completed directly on the official portal.
            </p>
            <p>
              • <strong>Security Reminder:</strong> Never share sensitive credentials with third-party agents. Ensure the browser address bar displays the official <code>.gov.in</code> or state domain.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel & Stay on Seva Setu
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
            >
              Proceed to Official Portal
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalRedirectModal;

