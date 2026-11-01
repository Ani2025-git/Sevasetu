import React from 'react';
import { ShieldAlert, ShieldCheck, Lock, Info, ExternalLink } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 bg-saffron text-navy px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Independent Citizen Assistance Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
          Platform Charter, Legal Disclaimer & Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last revised: Civic Demonstration Edition • West Bengal, India
        </p>
      </div>

      {/* Primary Legal Disclaimer Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-saffron" />
          1. Independent Technological Demonstration
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>Seva Setu ("Platform")</strong> is an independent civic information platform and citizen assistance guide.
          </p>
          <div className="p-4 bg-saffron-50 rounded-lg border border-saffron-200 text-saffron-950 font-medium">
            IMPORTANT: Seva Setu is NOT officially affiliated with, authorized by, sponsored by, or operated by the Government of West Bengal, the Department of Personnel and Administrative Reforms (P&AR), or any official Bangla Sahayata Kendra (BSK).
          </div>
          <p>
            The project aims to demonstrate how verified document preparation guidelines and offline centre directories empower citizens before they travel to administrative offices.
          </p>
          <p>
            For official government filings, welfare schemes, official application submissions, and official helpline access, citizens must always use the official portal at{' '}
            <a
              href="https://bsk.wb.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-digital underline font-semibold inline-flex items-center gap-1"
            >
              https://bsk.wb.gov.in <ExternalLink className="w-3 h-3 text-digital" />
            </a>.
          </p>
        </div>
      </div>

      {/* Queue Model & Waiting Times Disclaimer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <Info className="w-5 h-5 text-digital" />
          2. Queue Intelligence & Waiting Time Boundaries
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            Seva Setu operates under a strict <strong>"Verified Information Only"</strong> policy:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
            <li><strong>No Fabricated Waiting Times:</strong> Seva Setu does not simulate or invent artificial live wait durations.</li>
            <li><strong>Coming Soon Status:</strong> Live queue monitoring is currently in pilot calibration and will only be activated when certified on-ground observers are present.</li>
            <li><strong>No Guaranteed Speed:</strong> In-person processing depends on individual document validity, official server connectivity, and department staffing.</li>
          </ul>
        </div>
      </div>

      {/* Privacy Policy & Zero Citizen PII Storage */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <Lock className="w-5 h-5 text-indiaGreen" />
          3. Privacy Policy & Zero Citizen Document Storage
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            We adhere to the highest civic privacy standards:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
            <li><strong>No Sensitive Document Uploads:</strong> Seva Setu never asks for, records, uploads, or stores citizen Aadhaar numbers, PAN cards, or bank account passbooks.</li>
            <li><strong>Safe Direct Redirection:</strong> External application links always open official state portals directly, preceded by a safety confirmation modal.</li>
            <li><strong>Account Freedom:</strong> Citizens are not required to register to browse service checklists or find centres. Account registration is completely optional for saving checklists.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
