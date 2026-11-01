import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, ExternalLink, Heart, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 mt-20 border-t border-navy-800">
      {/* Disclaimer Banner Box */}
      <div className="bg-navy-800/80 border-b border-navy-700/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-sm space-y-1">
            <p className="font-semibold text-white flex items-center gap-2">
              <span>Independent Demonstration Project Notice</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded uppercase">
                Notice
              </span>
            </p>
            <p className="text-slate-300 text-xs leading-relaxed max-w-4xl">
              SevaQueue is an independent civic research and pilot prototype. 
              <strong className="text-white ml-1">
                It is not an official portal of the Government of West Bengal, the Department of Personnel & Administrative Reforms, or any Bangla Sahayata Kendra (BSK).
              </strong> 
              All centre metrics and queue reports shown represent demonstration observations and do not constitute an official government service commitment.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Vision */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SevaQueue</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            "Know Before You Visit." Empowering citizens with crowd awareness, verified service requirements, and published centre schedules.
          </p>
          <div className="text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Initial Pilot Focus:</p>
            <p>Bangla Sahayata Kendra (BSK)</p>
            <p>South 24 Parganas, West Bengal</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Public Access</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home & Pilot Overview</Link>
            </li>
            <li>
              <Link to="/centre" className="hover:text-white transition-colors">BSK Centre Details & Map</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Service Directory & Documents</Link>
            </li>
            <li>
              <Link to="/queue" className="hover:text-white transition-colors">Live Queue Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Official Resources & Pilot Docs */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Official Links & Docs</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://bsk.wb.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                Official BSK Portal <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://wb.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                Govt. of West Bengal <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-white transition-colors">Full Disclaimer Policy</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy & No-PII Policy</Link>
            </li>
          </ul>
        </div>

        {/* Staff & Observers */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Operations</h4>
          <p className="text-xs text-slate-400 mb-3">
            Authorized field observers and administrators manage real-time updates and queue reviews.
          </p>
          <div className="space-y-2">
            <Link
              to="/login"
              className="inline-block text-xs font-semibold px-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-colors"
            >
              Staff & Observer Portal
            </Link>
            <p className="text-[11px] text-slate-500">
              Demo Credentials: admin@sevaqueue.org / Admin@123
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-navy-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 SevaQueue Independent Demonstration Project. Designed for civic transparency.</p>
        <p className="flex items-center gap-1 text-slate-400">
          <span>Built with React, Flask & SQLite</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

