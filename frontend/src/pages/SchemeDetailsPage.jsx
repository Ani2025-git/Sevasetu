import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  ArrowLeft,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Printer,
  Share2,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { schemeService } from '../services/api';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const SchemeDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interactive Checklist State (saved to localStorage per scheme slug)
  const [checkedDocs, setCheckedDocs] = useState({});

  // External Redirect Modal
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    url: '',
    schemeName: ''
  });

  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const fetchSchemeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await schemeService.getScheme(slug);
        if (res.data.success) {
          setScheme(res.data.scheme);

          // Restore checklist progress from localStorage
          try {
            const saved = localStorage.getItem(`sevasetu_scheme_checklist_${slug}`);
            if (saved) {
              setCheckedDocs(JSON.parse(saved));
            }
          } catch (e) {
            console.error('Error loading checklist progress:', e);
          }
        } else {
          setError(res.data.message || 'Scheme details not found');
        }
      } catch (err) {
        console.error('Error fetching scheme details:', err);
        setError('Government scheme details could not be found or are not yet published.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeDetails();
  }, [slug]);

  // Toggle document checklist item
  const handleToggleDoc = (docIndex) => {
    setCheckedDocs((prev) => {
      const updated = { ...prev, [docIndex]: !prev[docIndex] };
      try {
        localStorage.setItem(`sevasetu_scheme_checklist_${slug}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving checklist:', e);
      }
      return updated;
    });
  };

  // Reset checklist
  const handleResetChecklist = () => {
    setCheckedDocs({});
    try {
      localStorage.removeItem(`sevasetu_scheme_checklist_${slug}`);
    } catch (e) {
      console.error('Error clearing checklist:', e);
    }
  };

  // Share Scheme Link
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: scheme?.name || 'Government Scheme on Seva Setu',
          text: scheme?.short_description || 'Check out this government scheme guide on Seva Setu.',
          url: shareUrl
        });
      } catch (e) {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48" />
          <div className="bg-white rounded-2xl p-8 space-y-4 border border-slate-200">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold text-[#173B72]">Scheme Not Found</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || 'This government scheme may have been archived or is awaiting administrative review.'}
          </p>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173B72] hover:bg-[#2878C8] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Schemes</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate document progress
  const totalDocs = scheme.required_documents?.length || 0;
  const completedDocs = Object.values(checkedDocs).filter(Boolean).length;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  const targetApplyUrl = scheme.official_application_url || scheme.official_info_url;

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500 truncate">
            <Link to="/" className="hover:text-[#173B72]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/schemes" className="hover:text-[#173B72]">Schemes</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#173B72] truncate">{scheme.name}</span>
          </div>

          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B72] hover:text-[#2878C8] shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Schemes</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* SECTION A: OVERVIEW HEADER CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#173B72] bg-[#EAF2FC] border border-[#2878C8]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {scheme.category_name}
              </span>

              <div className="flex items-center gap-2">
                {scheme.verification_status === 'VERIFIED' && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Official Scheme</span>
                  </span>
                )}
                {scheme.status === 'PUBLISHED' && (
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    Active & Published
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#173B72] leading-tight">
                {scheme.name}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">{scheme.department_name}</span>
              </p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-normal pt-2">
              {scheme.short_description}
            </p>

            {/* Target Beneficiary Highlight */}
            {scheme.beneficiary_summary && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EAF2FC] text-[#173B72] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Target Beneficiary Group
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#173B72]">
                    {scheme.beneficiary_summary}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Buttons Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {targetApplyUrl && (
                  <button
                    onClick={() =>
                      setRedirectModal({
                        isOpen: true,
                        url: targetApplyUrl,
                        schemeName: scheme.name
                      })
                    }
                    className="px-5 py-2.5 bg-[#2878C8] hover:bg-[#1f63a8] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>Apply on Official Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                {scheme.department_website && (
                  <a
                    href={scheme.department_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Department Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Share Scheme"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{copiedShare ? 'Link Copied!' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Print Guide"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION A.1: DETAILED SCHEME DESCRIPTION */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-5 h-5 text-[#2878C8]" />
            <h2 className="text-base sm:text-lg font-bold text-[#173B72]">
              About the Scheme
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
            {scheme.full_description}
          </div>
        </div>

        {/* SECTION B: ELIGIBILITY CRITERIA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#173B72]" />
              <h2 className="text-base sm:text-lg font-bold text-[#173B72]">
                Eligibility Criteria
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {scheme.eligibility_rules?.length || 0} Conditions Verified
            </span>
          </div>

          {scheme.eligibility_rules && scheme.eligibility_rules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheme.eligibility_rules.map((rule, idx) => (
                <div
                  key={rule.id || idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-[#2878C8]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#173B72] bg-[#EAF2FC] px-2 py-0.5 rounded">
                      {rule.rule_type || 'CRITERIA'}
                    </span>
                    {rule.is_mandatory && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#263445] leading-relaxed">
                    {rule.rule_description}
                  </p>

                  {/* Specific constraints tags */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                    {rule.minimum_age && rule.maximum_age && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Age: {rule.minimum_age} to {rule.maximum_age} yrs
                      </span>
                    )}
                    {rule.minimum_age && !rule.maximum_age && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Age: {rule.minimum_age}+ yrs
                      </span>
                    )}
                    {rule.maximum_income && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Income ceiling: Up to ₹{rule.maximum_income.toLocaleString('en-IN')}
                      </span>
                    )}
                    {rule.residence_requirement && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Residence: {rule.residence_requirement}
                      </span>
                    )}
                    {rule.occupation_requirement && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Occupation: {rule.occupation_requirement}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              General eligibility rules apply. Please verify exact conditions on the official portal.
            </p>
          )}
        </div>

        {/* SECTION C: REQUIRED DOCUMENTS CHECKLIST */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base sm:text-lg font-bold text-[#173B72]">
                  Required Documents Checklist
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Prepare these verified documents before beginning your application.
              </p>
            </div>

            {totalDocs > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  {completedDocs} of {totalDocs} Prepared ({progressPercent}%)
                </span>
                {completedDocs > 0 && (
                  <button
                    onClick={handleResetChecklist}
                    className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {totalDocs > 0 && (
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {scheme.required_documents && scheme.required_documents.length > 0 ? (
            <div className="space-y-3">
              {scheme.required_documents.map((doc, idx) => {
                const isChecked = Boolean(checkedDocs[idx]);
                return (
                  <div
                    key={doc.id || idx}
                    onClick={() => handleToggleDoc(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      isChecked
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-emerald-600 shrink-0"
                      aria-label={isChecked ? 'Mark document as unready' : 'Mark document as ready'}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-[#173B72]'
                          }`}
                        >
                          {doc.document_name}
                        </span>
                        {doc.is_mandatory && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            Mandatory
                          </span>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Standard identity and residence documents required. Refer to official guidelines.
            </p>
          )}
        </div>

        {/* SECTION D: APPLICATION PROCESS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-[#2878C8]" />
            <h2 className="text-base sm:text-lg font-bold text-[#173B72]">
              How to Apply (Application Process)
            </h2>
          </div>

          {scheme.application_instructions ? (
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {scheme.application_instructions}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Please visit your local Bangla Sahayata Kendra (BSK) or the official portal for application submission.
            </p>
          )}
        </div>

        {/* SECTION E: OFFICIAL APPLICATION CTA CARD */}
        <div className="bg-gradient-to-r from-[#173B72] to-[#2878C8] rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold text-saffron uppercase tracking-wider">
              Direct Government Submission
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Ready to Apply for {scheme.name}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
              Applications, biometric e-KYC, and state subsidy verifications are handled solely on authentic Government of West Bengal portals. Seva Setu never charges fees or collects login passwords.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {targetApplyUrl ? (
              <button
                onClick={() =>
                  setRedirectModal({
                    isOpen: true,
                    url: targetApplyUrl,
                    schemeName: scheme.name
                  })
                }
                className="px-6 py-3 bg-white hover:bg-slate-100 text-[#173B72] text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <span>Proceed to Official Government Portal</span>
                <ExternalLink className="w-4 h-4 text-[#2878C8]" />
              </button>
            ) : (
              <div className="p-3 bg-white/20 rounded-xl text-xs text-white">
                Direct online submission portal details are currently being verified by administrators.
              </div>
            )}
          </div>
        </div>

        {/* SECTION F: SOURCE, PROVENANCE & CITIZEN DISCLAIMER */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Info className="w-5 h-5 text-slate-500" />
            <h3 className="text-sm font-bold text-[#173B72]">
              Source Provenance & Verification Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Source Department</span>
              <p className="font-semibold text-[#173B72]">{scheme.department_name}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Last Verified Date</span>
              <p className="font-semibold text-[#173B72]">
                {scheme.last_verified_at
                  ? new Date(scheme.last_verified_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'Pending Verification'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Official Portal Link</span>
              {scheme.official_application_url || scheme.official_info_url ? (
                <a
                  href={scheme.official_application_url || scheme.official_info_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2878C8] hover:underline truncate block"
                >
                  {scheme.official_application_url || scheme.official_info_url}
                </a>
              ) : (
                <p className="text-slate-400 italic">Not available</p>
              )}
            </div>
          </div>

          {/* Official Sources List */}
          {scheme.official_sources && scheme.official_sources.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-700">Verified Reference Documents & Portals:</p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {scheme.official_sources.map((s, idx) => (
                  <li key={s.id || idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{s.source_title}:</span>
                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2878C8] hover:underline truncate"
                    >
                      {s.source_url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Public Disclaimer as per Section 6.F */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Notice to Citizens</p>
              <p className="mt-0.5">
                Scheme information is provided for citizen awareness. Final eligibility and approval are determined by the concerned government authority. Please verify details through the official portal before applying.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EXTERNAL REDIRECT MODAL */}
      <ExternalRedirectModal
        isOpen={redirectModal.isOpen}
        onClose={() => setRedirectModal({ isOpen: false, url: '', schemeName: '' })}
        targetUrl={redirectModal.url}
        serviceName={redirectModal.schemeName}
      />
    </div>
  );
};

export default SchemeDetailsPage;

