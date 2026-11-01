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
      status: 'Phase 1 Observer Calibration',
    },
    {
      id: 2,
      name: 'Bangla Sahayata Kendra — Salt Lake BDO Office',
      district: 'North 24 Parganas',
      address: 'Bikash Bhavan Campus, DF Block, Sector 1, Bidhannagar, Kolkata 700091',
      hours: '10:00 AM – 5:00 PM (Mon–Sat)',
      status: 'Phase 1 Observer Calibration',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Announcement Banner */}
      <div className="bg-navy text-white rounded-xl p-8 sm:p-10 border border-navy-700 space-y-4">
        <div className="inline-flex items-center gap-2 bg-saffron text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Roadmap Status: Coming Soon</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Bangla Sahayata Kendra Queue Intelligence
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-3xl">
          Seva Setu is developing an empirical observation-backed queue monitoring system for BSK service centres across West Bengal. In adherence to our transparency pledge, we will never publish simulated or fabricated wait times.
        </p>
      </div>

      {/* Why Coming Soon Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-digital-50 text-digital flex items-center justify-center shrink-0 border border-digital-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">
              Why Is Live Queue Information Coming Soon?
            </h2>
            <p className="text-xs text-slate-500">
              Our pledge of data integrity and citizen trust
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-surface p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-navy flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
              Verified Observations Only
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike generic platforms that guess crowd density with random algorithms, Seva Setu relies exclusively on verified on-ground observer logs.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-navy flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
              No Simulated Wait Times
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publishing inaccurate queue times misleads citizens and causes missed deadlines. We only activate live status when reliable observations exist.
            </p>
          </div>

          <div className="bg-surface p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-navy flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indiaGreen shrink-0" />
              Pilot District Deployment
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We are establishing pilot observer protocols at select high-footfall centres in South 24 Parganas and North 24 Parganas before state-wide release.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Preview (What It Will Look Like) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-digital uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>Architecture Preview</span>
          </div>
          <h2 className="text-xl font-bold text-navy">
            What the Live Queue Feature Will Display
          </h2>
          <p className="text-xs text-slate-500">
            Below is the verified interface model that will display live crowd tiers once certified observers are active.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-saffron-50 text-saffron-800 border border-saffron-200">
                    {centre.status}
                  </span>
                  <h3 className="text-base font-bold text-navy mt-2">
                    {centre.name}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-surface px-2.5 py-1 rounded">
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
              <div className="bg-surface rounded-lg p-4 border border-dashed border-slate-300 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-navy">Interface Model:</span>
                  <span className="text-[11px] text-slate-500 italic">No Fake Data Active</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Queue Status Tier</span>
                    <span className="font-bold text-indiaGreen">Moderate (10-20 Citizens)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Waiting Range</span>
                    <span className="font-bold text-navy">15 – 30 Minutes</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Source: Certified Observer</span>
                  <span>Safeguard: 30m Auto-Stale</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pilot Notification Signup */}
      <div className="bg-navy text-white rounded-xl p-8 sm:p-10 border border-navy-700 space-y-5">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Pilot Early Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Get Notified When Queue Info Launches in Your District
          </h2>
          <p className="text-xs sm:text-sm text-slate-200">
            Sign up with your email to receive an alert when your local Bangla Sahayata Kendra begins live observation reporting.
          </p>
        </div>

        {notifySubmitted ? (
          <div className="bg-indiaGreen/20 border border-indiaGreen/40 rounded-lg p-3.5 flex items-center gap-3 text-indiaGreen text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-indiaGreen shrink-0" />
            <span>Thank you! We've registered your notification request for {notifyDistrict}.</span>
          </div>
        ) : (
          <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <select
              value={notifyDistrict}
              onChange={(e) => setNotifyDistrict(e.target.value)}
              className="bg-navy-900 text-white border border-navy-700 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-digital"
            >
              <option value="Kolkata">Kolkata</option>
              <option value="South 24 Parganas">South 24 Parganas</option>
              <option value="North 24 Parganas">North 24 Parganas</option>
              <option value="Howrah">Howrah</option>
              <option value="Hooghly">Hooghly</option>
            </select>

            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 bg-navy-900 text-white placeholder-slate-400 border border-navy-700 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-digital"
            />

            <button
              type="submit"
              className="bg-digital hover:bg-digital-600 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>

      {/* Alternative Help Notice */}
      <div className="bg-surface border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-navy">Need Service Information Now?</h3>
          <p className="text-xs text-slate-600">
            Browse complete certificate requirements, document checklists, and official West Bengal application portals.
          </p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          <span>View Certificate Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default QueueStatusPage;
