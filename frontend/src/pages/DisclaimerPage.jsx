import React from 'react';
import { ShieldAlert, ShieldCheck, Lock, Info, ExternalLink } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Independent Demonstration Pilot</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Pilot Charter, Legal Disclaimer & Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">
          Last revised: Pilot Demonstration Edition • West Bengal, India
        </p>
      </div>

      {/* Primary Legal Disclaimer Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          1. Independent Technological Demonstration
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>SevaQueue ("Platform")</strong> is an independent academic, civic, and technological proof-of-concept prototype.
          </p>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 font-medium">
            IMPORTANT: SevaQueue is NOT officially affiliated with, authorized by, sponsored by, or operated by the Government of West Bengal, the Department of Personnel and Administrative Reforms (P&AR), or any official Bangla Sahayata Kendra (BSK).
          </div>
          <p>
            The project aims to demonstrate how community observation verification and published service preparation guidelines can empower citizens before they travel to administrative centres.
          </p>
          <p>
            For official government filings, welfare schemes, official application submissions, and official helpline access, citizens must always use the official portal at{' '}
            <a
              href="https://bsk.wb.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 underline font-semibold inline-flex items-center gap-1"
            >
              https://bsk.wb.gov.in <ExternalLink className="w-3 h-3" />
            </a>.
          </p>
        </div>
      </div>

      {/* Queue Model & Waiting Times Disclaimer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          2. Queue Intelligence & Waiting Time Boundaries
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            SevaQueue operates under a strict <strong>"Queue Information Only"</strong> pilot model:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
            <li><strong>No Fabricated Waiting Times:</strong> SevaQueue does not simulate or invent artificial live wait durations.</li>
            <li><strong>No Guaranteed Speed:</strong> Published status (Low, Moderate, High) indicates observed crowd density, not guaranteed counter service speeds. Counter processing depends on document validity, technical server links, and staffing.</li>
            <li><strong>Stale Threshold (30 Minutes):</strong> Observations older than 30 minutes are automatically flagged as stale to prevent misleading visitors.</li>
            <li><strong>Quality Review:</strong> Community submissions are verified by administrators and field observers before influencing public metrics.</li>
          </ul>
        </div>
      </div>

      {/* Privacy Policy & No-PII Commitment */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          3. Privacy Policy & Zero Citizen PII Storage
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            We adhere to the highest civic privacy standards:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
            <li><strong>No Citizen Registration:</strong> General citizens can access all centre directories, service document lists, and queue dashboards without creating an account or providing an email.</li>
            <li><strong>No Aadhaar or Identity Storage:</strong> SevaQueue never asks for, records, or stores citizen Aadhaar numbers, EPIC card numbers, or ration card numbers.</li>
            <li><strong>Client-Side & Server-Side PII Filters:</strong> Observation submission notes are actively scanned for phone numbers or identification sequences and rejected if detected.</li>
            <li><strong>Anonymous Submissions:</strong> Public crowd observations do not retain citizen IP or contact references.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;

