import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  Phone, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { publicService } from '../services/api';

const CentreDetailsPage = ({ onOpenObservationModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const centreIdParam = searchParams.get('id');

  useEffect(() => {
    const loadCentres = async () => {
      try {
        const res = await publicService.getCentres();
        if (res.data.success && res.data.centres.length > 0) {
          setCentres(res.data.centres);
          const targetId = centreIdParam ? parseInt(centreIdParam, 10) : res.data.centres[0].id;
          const found = res.data.centres.find(c => c.id === targetId) || res.data.centres[0];
          setSelectedCentre(found);
          loadCentreServices(found.id);
        }
      } catch (err) {
        console.error('Failed to load centres:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCentres();
  }, [centreIdParam]);

  const loadCentreServices = async (id) => {
    try {
      const res = await publicService.getCentreServices(id);
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error('Failed to load centre services:', err);
    }
  };

  const handleSelectCentre = (c) => {
    setSelectedCentre(c);
    setSearchParams({ id: c.id });
    loadCentreServices(c.id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-digital border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading centre information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Centre Switcher Tabs (if more than 1 centre) */}
      {centres.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-2">
            Select BSK Centre:
          </span>
          {centres.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCentre(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedCentre?.id === c.id
                  ? 'bg-navy text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Centre Hero Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-digital-50 text-digital border border-digital-200 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wider">
                {selectedCentre?.centre_type || 'Bangla Sahayata Kendra'}
              </span>
              <span className="bg-surface text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-slate-200">
                District: {selectedCentre?.district}
              </span>
              <span className="bg-surface text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-slate-200">
                Block: {selectedCentre?.block || 'Urban / SDO'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              {selectedCentre?.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <span>{selectedCentre?.address}</span>
            </p>
          </div>

          {/* Queue & Roadmap Status Box */}
          <div className="bg-surface border border-slate-200 rounded-lg p-5 shrink-0 flex flex-col justify-between space-y-3 min-w-[280px]">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Queue Tracking</span>
                <span className="text-saffron-800 font-bold bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                  Coming Soon
                </span>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live queue intelligence is in pilot observer calibration. In adherence to transparency, no fake wait times are shown.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                to="/queue"
                className="w-full py-2.5 px-3 bg-navy hover:bg-navy-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-saffron" />
                Queue Pilot Roadmap
              </Link>
            </div>
          </div>
        </div>

        {/* Info Grid (Hours, Holidays, Operator Count) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-surface border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
              <Clock className="w-4 h-4 text-digital" />
              Published Operating Hours
            </div>
            <p className="text-xs sm:text-sm font-bold text-navy">
              {selectedCentre?.operating_hours || '10:00 AM – 5:00 PM (Monday – Saturday)'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-saffron" />
              Notified Weekly Off & Holidays
            </div>
            <p className="text-xs sm:text-sm font-bold text-navy">
              {selectedCentre?.holidays || 'Sundays and West Bengal Gazetted Holidays'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-indiaGreen" />
              Service Fee Policy
            </div>
            <p className="text-xs sm:text-sm font-bold text-indiaGreen">
              100% Free Service by BSK Operators
            </p>
          </div>
        </div>
      </div>

      {/* Available Services at this Centre */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-digital" />
              Government Services Assisted at this Centre
            </h2>
            <p className="text-xs text-slate-500">
              Verify required documents checklist before visiting the counter
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-digital hover:text-navy flex items-center gap-1"
          >
            All Services Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-digital transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-digital-50 text-digital border border-digital-200">
                  {s.category || 'Certificate'}
                </span>
                <h3 className="text-base font-bold text-navy line-clamp-1">{s.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {s.required_documents?.length || 0} Required Docs
                </span>
                <Link
                  to={`/services/${s.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-digital hover:text-navy"
                >
                  Document Checklist <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CentreDetailsPage;
