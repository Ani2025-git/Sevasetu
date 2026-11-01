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
  PlusCircle, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Navigation
} from 'lucide-react';
import { publicService } from '../services/api';
import QueueBadge from '../components/QueueBadge';

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
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading centre data...</p>
      </div>
    );
  }

  const queueInfo = selectedCentre?.queue_summary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Centre Switcher Tabs (if more than 1 centre) */}
      {centres.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">
            Demonstration Centres:
          </span>
          {centres.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCentre(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedCentre?.id === c.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Centre Hero Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wider">
                Pilot Demonstration
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wider">
                District: {selectedCentre?.district}
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wider">
                Block: {selectedCentre?.block}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              {selectedCentre?.name}
            </h1>

            <p className="text-sm text-slate-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{selectedCentre?.address}</span>
            </p>
          </div>

          {/* Queue & Action column */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shrink-0 flex flex-col justify-between space-y-3 min-w-[280px]">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Current Queue Status
              </p>
              <div className="flex items-center gap-2">
                <QueueBadge
                  status={queueInfo?.status}
                  isStale={queueInfo?.is_stale}
                  size="lg"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {queueInfo?.is_stale ? (
                  <span className="text-amber-600 font-semibold">No recent update (&gt;30 mins)</span>
                ) : (
                  <span>Verified ~{queueInfo?.minutes_ago ?? 0}m ago</span>
                )}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              {onOpenObservationModal && (
                <button
                  onClick={onOpenObservationModal}
                  className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Submit Queue Observation
                </button>
              )}
              <Link
                to="/queue"
                className="w-full text-center block text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Inspect Queue Evidence & History
              </Link>
            </div>
          </div>
        </div>

        {/* Operating Hours, Holidays & Contact Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Operating Hours
            </p>
            <p className="text-sm font-bold text-slate-800">
              {selectedCentre?.opening_hours}
            </p>
            <p className="text-[11px] text-slate-500">Citizen counters operate strictly during published timings</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              Weekly Holidays
            </p>
            <p className="text-sm font-bold text-slate-800">
              {selectedCentre?.weekly_holidays}
            </p>
            <p className="text-[11px] text-slate-500">Service counters are closed on notified holidays</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              Approved Contacts
            </p>
            <p className="text-sm font-bold text-slate-800 truncate">
              {selectedCentre?.contact_details || 'Official In-Person Assistance Only'}
            </p>
            {selectedCentre?.official_source_url && (
              <a
                href={selectedCentre.official_source_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Official State Portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Verified Map Representation */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              Location & Verification Map
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              Verified Pilot Coordinates
            </span>
          </div>
          <div className="h-44 rounded-xl bg-gradient-to-br from-slate-200 via-blue-50 to-slate-200 border border-slate-300 relative overflow-hidden flex items-center justify-center p-4">
            {/* Styled Map Graphic */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="text-center space-y-2 relative z-10 max-w-sm">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-navy-900">{selectedCentre?.name}</p>
              <p className="text-[11px] text-slate-600">{selectedCentre?.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCentre?.name + ' ' + selectedCentre?.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50"
              >
                Open in Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Available Services at this Centre */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-900">
              Services Offered at this Centre ({services.length})
            </h2>
            <p className="text-xs text-slate-500">
              Each service below outlines required documents and official portal links.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-blue-700 hover:text-blue-800"
          >
            Explore Master Services Directory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {srv.category}
                </span>
                <h3 className="font-bold text-base text-navy-900 leading-snug">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {srv.description}
                </p>

                {srv.required_documents && srv.required_documents.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">
                      Required Documents ({srv.required_documents.length}):
                    </p>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                      {srv.required_documents.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="line-clamp-1">{doc}</li>
                      ))}
                    </ul>
                    {srv.required_documents.length > 3 && (
                      <p className="text-[10px] text-blue-600 font-semibold mt-1">
                        +{srv.required_documents.length - 3} more documents
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {srv.official_source_url ? (
                  <a
                    href={srv.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px]">Walk-in Desk</span>
                )}
                <span className="text-[10px] text-slate-400">
                  Verified: {srv.last_verified_at ? srv.last_verified_at.split('T')[0] : 'Recent'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CentreDetailsPage;

