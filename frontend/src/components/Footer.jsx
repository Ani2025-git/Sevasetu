import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-[#263445] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-block">
              <img
                src="/assets/brand/seva-setu-logo.png"
                alt="Seva Setu Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
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
                <Link to="/schemes" className="text-slate-600 hover:text-[#2878C8] transition-colors">
                  Government Schemes
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

        {/* Developer Credit */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-center sm:text-left">
            <span className="text-slate-700 font-medium">
              Developed by{' '}
              <a
                href="https://ani2025-git.github.io/my-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                translate="no"
                className="font-bold text-[#173B72] hover:text-[#2878C8] transition-colors underline decoration-slate-300 hover:decoration-[#2878C8] underline-offset-2 notranslate"
              >
                Animesh Mishra
              </a>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-slate-500 font-normal">
              Frontend Developer &amp; UI Engineer
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-center">
            <span className="text-slate-500 font-medium">Portfolio:</span>
            <a
              href="https://ani2025-git.github.io/my-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              translate="no"
              className="inline-flex items-center gap-1 text-[#2878C8] hover:text-[#173B72] font-semibold transition-colors underline decoration-blue-200 hover:decoration-[#173B72] underline-offset-2 notranslate break-all"
            >
              <span>https://ani2025-git.github.io/my-portfolio/</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
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
