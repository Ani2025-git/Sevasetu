import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 mt-20 border-t border-navy-800">
      {/* Notice Banner */}
      <div className="bg-navy-800/80 border-b border-navy-700/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-white flex items-center gap-2">
              <span>Important Citizen Notice</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-md uppercase">
                Independent Platform
              </span>
            </p>
            <p className="text-slate-300 leading-relaxed max-w-5xl">
              <strong>Seva Setu</strong> is an independent citizen assistance and information guide. It is not an official government website and has no direct affiliation with the Government of West Bengal or any Bangla Sahayata Kendra. All official application redirects navigate securely to legitimate state portals (e.g. <code>edistrict.wb.gov.in</code>, <code>castcertificatewb.gov.in</code>, <code>janmasadak.wb.gov.in</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                <path d="M4 14h16" />
                <path d="M12 9v10" />
              </svg>
            </div>
            <span className="text-lg font-black text-white tracking-tight">Seva Setu</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            "Government Services, Made Simpler." Connecting West Bengal citizens with verified document requirements, offline BSK guidance, and direct application portals.
          </p>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
            <p className="text-slate-300 font-semibold">Jurisdiction & Scope:</p>
            <p>Citizen Information Support • West Bengal, India</p>
          </div>
        </div>

        {/* Certificate Services */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Certificate Guides</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Income Certificate</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Caste Certificate (SC/ST/OBC)</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Residential & Domicile</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Birth Registration Guide</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Death Certificate Guide</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Digital Ration Card</Link>
            </li>
          </ul>
        </div>

        {/* Official Resources */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Official State Portals</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://bsk.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                Bangla Sahayata Kendra <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://edistrict.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                WB e-District 2.0 <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://castcertificatewb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                Caste Certificate Portal <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://janmasadak.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                Janma-Mrityu Tathya <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://food.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
              >
                Food & Supplies Portal <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Platform & Staff */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform & Legal</h4>
          <ul className="space-y-2 text-xs mb-4">
            <li>
              <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer & Pilot Charter</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy & No-PII Policy</Link>
            </li>
            <li>
              <Link to="/centre" className="hover:text-white transition-colors">Locate BSK Centre</Link>
            </li>
          </ul>
          <div className="pt-2 border-t border-navy-800">
            <Link
              to="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-colors inline-block"
            >
              Staff Portal Access
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-navy-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Seva Setu Independent Citizen Assistance Platform.</p>
        <p className="text-[11px] text-slate-400">
          Built for Bengal Citizens with Privacy First • No Aadhaar Collected
        </p>
      </div>
    </footer>
  );
};

export default Footer;
