import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-[#263445] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#173B72] flex items-center justify-center text-white shadow-xs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#F39A32]">
                  <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                  <path d="M4 14h16" />
                  <path d="M12 9v10" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#173B72]">
                Seva <span className="text-[#F39A32]">Setu</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              An independent civic platform designed to help West Bengal citizens understand government certificate procedures, prepare required documents, and access official application portals directly.
            </p>
            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-slate-200/80 text-xs text-slate-600">
              <strong className="text-[#173B72] block mb-0.5">Independent Citizen Initiative:</strong>
              Seva Setu is not an official government website and has no administrative affiliation with the Government of West Bengal or Bangla Sahayata Kendras. All applications are completed exclusively on official government portals.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#173B72] uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-slate-600 hover:text-[#2878C8] transition-colors">
                  Services Directory
                </Link>
              </li>
              <li>
                <Link to="/centre" className="text-slate-600 hover:text-[#2878C8] transition-colors">
                  BSK Centres
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-slate-600 hover:text-[#2878C8] transition-colors">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold text-[#173B72] uppercase tracking-wider mb-3">Compliance & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="text-slate-600 hover:text-[#2878C8] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-[#2878C8] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Seva Setu. Independent citizen service platform for West Bengal.</p>
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="hover:text-[#173B72] transition-colors">Disclaimer</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#173B72] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
