import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, ShieldCheck, Landmark } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy text-slate-200 mt-20 border-t border-navy-700">
      {/* Tricolor Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-saffron" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-indiaGreen" />
      </div>

      {/* Citizen Safety & Transparency Strip */}
      <div className="bg-navy-900 border-b border-navy-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-2.5 bg-saffron/15 text-saffron rounded-xl border border-saffron/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Citizen Transparency & Safety Charter</span>
              <span className="text-[10px] bg-saffron text-navy font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Independent Platform
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-5xl">
              <strong>Seva Setu</strong> is an independent citizen assistance portal developed to simplify West Bengal public services and document requirements. It is not an official government platform and does not possess administrative affiliation with the Government of West Bengal or Bangla Sahayata Kendras. Official application submissions take place strictly on verified state portals (e.g., <code>edistrict.wb.gov.in</code>, <code>castcertificatewb.gov.in</code>). Seva Setu never asks for OTPs, fees, or personal identity cards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-saffron border border-white/20">
              <Landmark className="w-4 h-4 text-saffron" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">Seva Setu</span>
              <span className="text-[10px] font-bold text-saffron ml-1.5 uppercase">WB</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "Your Government Services, Made Simple." Helping West Bengal citizens understand mandatory documents, find nearby BSK desks, and apply securely through official government portals.
          </p>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-2 border-t border-navy-700">
            <p className="text-slate-200 font-semibold">Scope of Service:</p>
            <p>Citizen Information & Document Preparation • West Bengal, India</p>
          </div>
        </div>

        {/* Certificate Services */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
            Public Certificate Guides
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Income Certificate</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Caste Certificate (SC / ST / OBC)</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Residential & Domicile Proof</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Birth Registration Certificate</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Death Certificate Registration</Link>
            </li>
            <li>
              <Link to="/services" className="text-slate-300 hover:text-white transition-colors">Digital Ration Card (NFSA / RKSY)</Link>
            </li>
          </ul>
        </div>

        {/* Official Resources */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-digital" />
            Official State Portals
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://bsk.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-digital-200 hover:underline"
              >
                Bangla Sahayata Kendra <ExternalLink className="w-3 h-3 text-digital" />
              </a>
            </li>
            <li>
              <a
                href="https://edistrict.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-digital-200 hover:underline"
              >
                WB e-District 2.0 <ExternalLink className="w-3 h-3 text-digital" />
              </a>
            </li>
            <li>
              <a
                href="https://castcertificatewb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-digital-200 hover:underline"
              >
                Oasis Caste Portal <ExternalLink className="w-3 h-3 text-digital" />
              </a>
            </li>
            <li>
              <a
                href="https://janmamrityutathya.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-digital-200 hover:underline"
              >
                Janma-Mrityu Tathya <ExternalLink className="w-3 h-3 text-digital" />
              </a>
            </li>
            <li>
              <a
                href="https://food.wb.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-digital-200 hover:underline"
              >
                Food & Supplies Dept <ExternalLink className="w-3 h-3 text-digital" />
              </a>
            </li>
          </ul>
        </div>

        {/* Assistance & Policies */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indiaGreen" />
            Citizen Assistance
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/centre" className="text-slate-300 hover:text-white transition-colors">Find Nearest BSK Centre</Link>
            </li>
            <li>
              <Link to="/queue" className="text-slate-300 hover:text-white transition-colors">Queue Status Roadmap</Link>
            </li>
            <li>
              <Link to="/disclaimer" className="text-slate-300 hover:text-white transition-colors">Platform Charter & Disclaimer</Link>
            </li>
            <li>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Citizen & Staff Login</Link>
            </li>
          </ul>

          <div className="mt-5 p-3.5 bg-navy-900 rounded-xl border border-navy-700 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-indiaGreen font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Free Government Service
            </div>
            <p>
              Data Entry Operators at BSK counters provide digital form submission completely free of charge.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="border-t border-navy-700 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Seva Setu. Independent civic technology platform for West Bengal.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/disclaimer" className="hover:text-slate-200 transition-colors">Legal Disclaimer</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">Citizen Privacy</Link>
            <span>•</span>
            <span className="text-slate-300">West Bengal, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
