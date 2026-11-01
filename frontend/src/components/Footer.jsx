import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Heart, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 mt-20 border-t border-navy-900">
      {/* Notice & Disclaimer Banner */}
      <div className="bg-navy-900/90 border-b border-navy-800/80 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Important Citizen Safety Notice</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Independent Platform
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-5xl">
              <strong>Seva Setu</strong> is an independent digital citizen assistance and information guide. It is not an official government website and has no direct affiliation with the Government of West Bengal or any Bangla Sahayata Kendra. All official application redirects navigate securely to legitimate state portals (e.g. <code>edistrict.wb.gov.in</code>, <code>castcertificatewb.gov.in</code>, <code>janmamrityutathya.wb.gov.in</code>). Seva Setu never collects sensitive documents, Aadhaar cards, or application fees.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                <path d="M4 14h16" />
                <path d="M12 9v10" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">Seva Setu</span>
              <span className="text-[10px] font-bold text-blue-400 ml-1.5 uppercase">WB</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            "Government Services, Made Simpler." Connecting West Bengal citizens with verified document requirements, offline BSK guidance, and direct application portals without intermediaries.
          </p>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1 border-t border-navy-800">
            <p className="text-slate-300 font-semibold">Jurisdiction & Scope:</p>
            <p>Citizen Information Support • West Bengal, India</p>
          </div>
        </div>

        {/* Certificate Services */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Verified Certificate Guides
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Income Certificate</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Caste Certificate (SC / ST / OBC)</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Residential & Domicile</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Birth Registration Guide</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Death Certificate Guide</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Digital Ration Card (NFSA / RKSY)</Link>
            </li>
          </ul>
        </div>

        {/* Official Resources */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Official State Portals
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://bsk.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-blue-400 hover:underline"
              >
                Bangla Sahayata Kendra <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://edistrict.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-blue-400 hover:underline"
              >
                WB e-District 2.0 <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://castcertificatewb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-blue-400 hover:underline"
              >
                Oasis Caste Portal <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://janmamrityutathya.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-blue-400 hover:underline"
              >
                Janma-Mrityu Tathya <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://food.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-blue-400 hover:underline"
              >
                Food & Supplies Dept <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Citizen Privacy & Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Citizen Assistance
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/centre" className="text-slate-300 hover:text-white transition-colors">Find Nearest BSK Centre</Link>
            </li>
            <li>
              <Link to="/queue" className="text-slate-300 hover:text-white transition-colors">BSK Queue Info (Roadmap)</Link>
            </li>
            <li>
              <Link to="/disclaimer" className="text-slate-300 hover:text-white transition-colors">Safety & Independent Disclaimer</Link>
            </li>
            <li>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Citizen & Staff Login</Link>
            </li>
          </ul>

          <div className="mt-5 p-3.5 bg-navy-900 rounded-2xl border border-navy-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free Public Resource
            </div>
            <p>
              Applying through BSK operators is completely free of government service fees.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright & Disclaimer Line */}
      <div className="border-t border-navy-900 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Seva Setu. Independent civic technology demonstration platform.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Citizen Privacy</Link>
            <span>•</span>
            <span className="text-slate-400">West Bengal, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
