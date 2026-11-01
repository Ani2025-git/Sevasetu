import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  AlertCircle,
  Users,
  MapPin,
  CheckCircle2,
  Bell,
  ArrowRight,
  Eye,
  Building2,
  Calendar,
  Lock,
  Search
} from 'lucide-react';

const QueueStatusPage = () => {
  const [notifyDistrict, setNotifyDistrict] = useState('Kolkata');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifySubmitted(true);
  };

  const previewCentres = [
    {
      id: 1,
      name: 'Bangla Sahayata Kendra — Alipore SDO Office',
      district: 'South 24 Parganas',
      address: 'Alipore SDO Compound, Belvidere Road, Kolkata 700027',
      hours: '10:00 AM – 5:00 PM (Mon–Sat)',
      status: 'Coming Soon in Phase 1 Pilot',
    },
    {
      id: 2,
      name: 'Bangla Sahayata Kendra — Salt Lake BDO Office',
      district: 'North 24 Parganas',
      address: 'Bikash Bhavan Campus, DF Block, Sector 1, Bidhannagar, Kolkata 700091',
      hours: '10:00 AM – 5:00 PM (Mon–Sat)',
      status: 'Coming Soon in Phase 1 Pilot',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Announcement */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 [mask-image:radial-gradient(white,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-400/30">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Pilot Feature Under Calibration • Phase 1 Roadmap</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bangla Sahayata Kendra (BSK) Queue Intelligence
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Seva Setu is developing an independent observation-backed queue monitoring system for BSK service centres across West Bengal. We refuse to publish simulated or fake wait numbers.
          </p>
        </div>
      </div>

      {/* Why Coming Soon Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Why Is Live Queue Information "Coming Soon"?
            </h2>
            <p className="text-xs text-slate-500">
              Our pledge of authenticity and public trust
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Verified Observations Only
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike generic platforms that guess crowd density with random numbers, Seva Setu relies exclusively on verified on-ground observer reports.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              No Simulated Wait Times
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publishing inaccurate queue times misleads citizens and causes missed deadlines. We only activate live status when reliable observations exist.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Independent Pilot Deployment
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We are establishing pilot observer protocols at select high-footfall centres in South 24 Parganas and North 24 Parganas before state-wide launch.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Preview (What It Will Look Like) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>Design Blueprint & Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            What the Live Queue Feature Will Display
          </h2>
          <p className="text-xs text-slate-500">
            Below is the interface structure that will display live updates for each verified BSK centre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {centre.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {centre.name}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                  {centre.district}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{centre.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{centre.hours}</span>
                </div>
              </div>

              {/* Sample Live Dashboard Mockup */}
              <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Sample Queue Metrics:</span>
                  <span className="text-[11px] text-slate-400 italic">Interface Preview</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Queue Status</span>
                    <span className="font-bold text-emerald-600">Moderate (10-20 Citizens)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Est. Counter Wait</span>
                    <span className="font-bold text-slate-800">15 – 30 Minutes</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Source: Verified Observer</span>
                  <span>Updates: Real-time</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pilot Notification Signup */}
      <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-10 border border-blue-900 shadow-xl space-y-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Pilot Early Access</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Get Notified When Queue Info Launches in Your District
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Sign up with your email to receive an alert when your local Bangla Sahayata Kendra begins live observation reporting.
          </p>
        </div>

        {notifySubmitted ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Thank you! We've registered your notification request for {notifyDistrict}.</span>
          </div>
        ) : (
          <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <select
              value={notifyDistrict}
              onChange={(e) => setNotifyDistrict(e.target.value)}
              className="bg-navy-900 text-white border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Kolkata">Kolkata</option>
              <option value="South 24 Parganas">South 24 Parganas</option>
              <option value="North 24 Parganas">North 24 Parganas</option>
              <option value="Howrah">Howrah</option>
              <option value="Hooghly">Hooghly</option>
              <option value="Paschim Medinipur">Paschim Medinipur</option>
              <option value="Purba Medinipur">Purba Medinipur</option>
              <option value="Nadia">Nadia</option>
              <option value="Murshidabad">Murshidabad</option>
              <option value="Bardhaman">Bardhaman</option>
              <option value="Other WB District">Other WB District</option>
            </select>

            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 bg-navy-900 text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>

      {/* Alternative Help Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800">Need Service Information Now?</h3>
          <p className="text-xs text-slate-600">
            Browse full certificate requirements, document checklists, and official West Bengal application portals.
          </p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <span>View Certificate Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default QueueStatusPage;
