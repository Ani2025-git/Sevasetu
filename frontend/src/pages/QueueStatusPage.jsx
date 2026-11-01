import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  MapPin, 
  RefreshCw, 
  PlusCircle, 
  Info, 
  ExternalLink,
  History,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { publicService } from '../services/api';
import QueueBadge from '../components/QueueBadge';

const QueueStatusPage = ({ onOpenObservationModal }) => {
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (centreId = null) => {
    try {
      const res = await publicService.getCentres();
      if (res.data.success && res.data.centres.length > 0) {
        setCentres(res.data.centres);
        const active = centreId 
          ? res.data.centres.find(c => c.id === centreId) || res.data.centres[0]
          : res.data.centres[0];
        setSelectedCentre(active);
        setQueueData(active.queue_summary);
      }
    } catch (err) {
      console.error('Failed to load queue data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh queue state every 60 seconds
    const interval = setInterval(() => {
      loadData(selectedCentre?.id);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCentre = (c) => {
    setSelectedCentre(c);
    setQueueData(c.queue_summary);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(selectedCentre?.id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading real-time queue intelligence...</p>
      </div>
    );
  }

  const isStale = queueData?.is_stale;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <Clock className="w-3.5 h-3.5" />
            Crowd Intelligence Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Live Queue & Waiting Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical observations from reviewed observers and citizen field logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
          {onOpenObservationModal && (
            <button
              onClick={onOpenObservationModal}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Live Observation
            </button>
          )}
        </div>
      </div>

      {/* Centre Selector Pills */}
      {centres.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Selected BSK Centre:
          </span>
          {centres.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCentre(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedCentre?.id === c.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Stale Warning Banner (If status is older than threshold) */}
      {isStale && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-4 animate-fadeIn shadow-sm">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-amber-900">
              No Recent Update — Please confirm with the centre.
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed max-w-4xl">
              The latest reviewed observation was published more than {queueData?.stale_threshold_minutes || 30} minutes ago. 
              Under SevaQueue pilot integrity policy, expired reports are marked stale to protect citizens from relying on outdated crowd estimations.
            </p>
          </div>
        </div>
      )}

      {/* Main Status Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Status Focus (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Monitored Service Centre
              </p>
              <h2 className="text-2xl font-bold text-navy-900">{selectedCentre?.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedCentre?.address}</span>
              </p>
            </div>

            <div className="text-right">
              <QueueBadge
                status={queueData?.status}
                isStale={isStale}
                size="lg"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Status Model: Evidence-based Queue Only
              </p>
            </div>
          </div>

          {/* Core Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Last Update
              </p>
              <p className="text-base font-bold text-slate-800">
                {queueData?.last_updated ? `${queueData.minutes_ago}m ago` : 'None Recorded'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {queueData?.last_updated ? new Date(queueData.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending review'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                Supporting Data
              </p>
              <p className="text-base font-bold text-slate-800">
                {queueData?.supporting_observations || 0} Observations
              </p>
              <p className="text-[11px] text-slate-500">
                {queueData?.recent_observations_count || 0} in last 2 hrs
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Source Type
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {queueData?.source_type || 'OBSERVER_VERIFIED'}
              </p>
              <p className="text-[11px] text-slate-500">
                Published by {queueData?.author_name || 'Admin'}
              </p>
            </div>
          </div>

          {/* Verification Statement */}
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-1.5 text-xs text-blue-900">
            <p className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-700" />
              Information Source & Evidence Trace
            </p>
            <p className="leading-relaxed">
              <strong>Source Description:</strong> {queueData?.source_description || 'Direct administrative audit following observer verification.'}
            </p>
            <p className="text-slate-600 text-[11px]">
              {queueData?.reliability_note}
            </p>
          </div>
        </div>

        {/* Right Status Guidelines & Legend */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-navy-900">
              Queue Status Classification
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">LOW (0 - 15 mins)</p>
                  <p className="text-emerald-700">Minimal queue observed. Multiple service counters operational.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">MODERATE (15 - 35 mins)</p>
                  <p className="text-amber-700">Steady queue. Normal processing times for certificates and ration queries.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900">HIGH (35+ mins)</p>
                  <p className="text-rose-700">Elevated crowd volume. Token dispensing may experience delay.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">UNKNOWN / STALE</p>
                  <p className="text-slate-600">No recent observation submitted within 30 minutes. Status unverified.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>Pilot Integrity Rule:</strong> SevaQueue never fabricates live waiting times. Community reports must be corroborated by pilot coordinators before publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatusPage;

