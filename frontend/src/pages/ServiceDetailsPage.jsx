import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Building2,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Printer,
  ExternalLink,
  MapPin,
  ArrowLeft,
  Bookmark,
  Share2,
  AlertCircle,
  ChevronRight,
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { publicService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExternalRedirectModal from '../components/ExternalRedirectModal';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Document checklist state (persisted in localStorage per service)
  const [checkedDocs, setCheckedDocs] = useState({});
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // External Redirect Modal
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await publicService.getService(id);
        if (res.data.success) {
          setService(res.data.service);

          // Restore checklist progress from localStorage
          const storageKey = `sevasetu_checklist_${id}`;
          try {
            const savedProgress = localStorage.getItem(storageKey);
            if (savedProgress) {
              setCheckedDocs(JSON.parse(savedProgress));
            }
          } catch {
            // ignore
          }
        } else {
          setError(res.data.message || 'Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const checkSavedStatus = async () => {
      if (isAuthenticated) {
        try {
          const res = await publicService.getSavedServices();
          if (res.data.success) {
            const found = res.data.saved_services.some((s) => s.service_id === parseInt(id, 10));
            setIsSaved(found);
          }
        } catch {
          // ignore
        }
      }
    };

    fetchService();
    checkSavedStatus();
  }, [id, isAuthenticated]);

  const toggleDoc = (docIndex) => {
    setCheckedDocs((prev) => {
      const updated = { ...prev, [docIndex]: !prev[docIndex] };
      try {
        localStorage.setItem(`sevasetu_checklist_${id}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetChecklist = () => {
    setCheckedDocs({});
    try {
      localStorage.removeItem(`sevasetu_checklist_${id}`);
    } catch {
      // ignore
    }
  };

  const copyChecklistToClipboard = () => {
    if (!service || !service.required_documents) return;
    const text = service.required_documents
      .map((doc, idx) => `[${checkedDocs[idx] ? 'X' : ' '}] ${doc}`)
      .join('\n');
    navigator.clipboard.writeText(`${service.name} — Required Documents Checklist:\n\n${text}`);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2000);
  };

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please sign in as a citizen to save this service to your dashboard.');
      return;
    }
    try {
      if (isSaved) {
        await publicService.removeSavedService(service.id);
        setIsSaved(false);
      } else {
        await publicService.saveService(service.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-slate-200 rounded-2xl" />
            <div className="h-96 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Certificate Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'The requested service does not exist.'}</p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 bg-navy-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const docs = service.required_documents || [];
  const completedCount = docs.filter((_, idx) => checkedDocs[idx]).length;
  const progressPercent = docs.length > 0 ? Math.round((completedCount / docs.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/services" className="hover:text-slate-900 transition-colors">Services</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 truncate max-w-xs">{service.name}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {service.category || 'Certificate'}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {service.verification_status || 'Verified State Guideline'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {service.name}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">{service.department || 'Government of West Bengal'}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {service.description}
            </p>
          </div>

          {/* Action buttons (Bookmark & Apply) */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-amber-500' : ''}`} />
              <span>{isSaved ? 'Saved to Dashboard' : 'Save Service'}</span>
            </button>

            {service.online_apply_url && (
              <button
                onClick={() => setIsRedirectModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Expected Timeline
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              {service.expected_processing_time || '7 - 15 Working Days'}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              Application Fee
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              {service.fees || 'Free'}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Mandatory Proofs
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              {docs.length} Documents
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              BSK Assistance
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              Available at BSK
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Eligibility, Online & Offline Application Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Section */}
          {service.eligibility && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Eligibility Criteria
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                {service.eligibility}
              </div>
            </div>
          )}

          {/* Online Application Guide */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                How to Apply Online (Direct Portal)
              </h2>
              {service.online_apply_url && (
                <button
                  onClick={() => setIsRedirectModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Official Link <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {service.application_process ||
                '1. Prepare your scanned documents according to the checklist.\n2. Visit the official West Bengal portal.\n3. Register with your mobile number and email ID.\n4. Fill in the online form and upload required certificates.\n5. Save your Application Acknowledgment Number for tracking.'}
            </div>

            {service.online_apply_url && (
              <div className="pt-2">
                <button
                  onClick={() => setIsRedirectModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <span>Proceed to Official Application Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Offline Application / BSK Help */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              Offline Application & Bangla Sahayata Kendra (BSK)
            </h2>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {service.offline_instructions ||
                'If you prefer applying in person or do not have computer/internet access:\n\n1. Carry physical copies of all required documents.\n2. Visit your nearest Bangla Sahayata Kendra (BSK) or Block Development Office (BDO) / SDO Office.\n3. The BSK Data Entry Operator will submit your digital application free of government service charge.\n4. Collect your printed physical receipt.'}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/centre"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Find Nearest BSK Centre
              </Link>
            </div>
          </div>

          {/* Privacy & Safety Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              Independent Citizen Safety Notice
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Seva Setu is an independent educational initiative. We never store, collect, or upload your sensitive documents (such as Aadhaar card, PAN card, or bank passbooks). All actual applications and document submissions must be done directly on verified Government of West Bengal web portals or physically at recognized BSK centres.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Document Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Document Checklist
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tick off documents as you prepare them
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={copyChecklistToClipboard}
                  title="Copy checklist"
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs"
                >
                  {copiedChecklist ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => window.print()}
                  title="Print checklist"
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checklist Progress Bar */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Preparation Progress</span>
                <span className={progressPercent === 100 ? 'text-emerald-600' : 'text-blue-600'}>
                  {progressPercent}% ({completedCount}/{docs.length})
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {progressPercent === 100 && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  All required documents ready for application!
                </div>
              )}
            </div>

            {/* Interactive Checklist Items */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <span
                      className={`text-xs leading-relaxed ${
                        isChecked ? 'line-through text-slate-500' : 'font-medium'
                      }`}
                    >
                      {doc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reset option */}
            {completedCount > 0 && (
              <div className="text-right">
                <button
                  onClick={resetChecklist}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                >
                  Reset checklist progress
                </button>
              </div>
            )}

            {/* Quick tips */}
            <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-100 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-blue-900 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Helpful Verification Tip
              </div>
              <p>
                Keep digital copies (under 200 KB in PDF or JPEG format) ready before starting the online e-District form.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* External Redirect Modal */}
      <ExternalRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
        targetUrl={service.online_apply_url}
        serviceName={service.name}
        portalName={service.department || 'Official West Bengal Government Portal'}
      />
    </div>
  );
};

export default ServiceDetailsPage;

