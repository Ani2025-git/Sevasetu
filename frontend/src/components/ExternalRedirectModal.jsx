import React from 'react';
import { ExternalLink, ShieldAlert, X, ShieldCheck } from 'lucide-react';

const ExternalRedirectModal = ({ isOpen, onClose, targetUrl, serviceName }) => {
  if (!isOpen || !targetUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-navy text-white p-5 flex items-start justify-between border-b border-navy-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-saffron text-navy flex items-center justify-center shrink-0 font-bold">
              <ShieldAlert className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">Official State Portal Notice</h3>
              <p className="text-xs text-slate-300 mt-0.5">Government Application Redirection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-saffron-50 border border-saffron-200 rounded-lg space-y-1.5 text-xs text-saffron-950">
            <p className="font-bold text-sm text-saffron-900">
              You are navigating to an official government portal
            </p>
            <p className="leading-relaxed">
              Target destination for <strong>{serviceName || 'this service'}</strong>:
            </p>
            <p className="font-mono text-navy bg-white p-2 rounded border border-saffron-200 truncate mt-1 text-xs">
              {targetUrl}
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Independent Guidance:</strong> Seva Setu prepares your document checklist and provides direct portal access. Official form submission and verification take place solely on government servers.
            </p>
            <p>
              • <strong>Security Caution:</strong> Never disclose OTPs or passwords to unauthorized agents. Ensure the browser address bar displays the official <code>.gov.in</code> domain.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-digital hover:bg-digital-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Proceed to Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalRedirectModal;
