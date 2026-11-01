import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, UserCheck, KeyRound } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const isExpired = searchParams.get('expired') === '1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await login(email.trim(), password);
      if (data.success) {
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'observer') {
          navigate('/observer');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@sevaqueue.org');
      setPassword('Admin@123');
    } else {
      setEmail('observer@sevaqueue.org');
      setPassword('Observer@123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-navy-900">Staff & Observer Sign In</h1>
        <p className="text-xs text-slate-500">
          Authorized access for field observers and centre administrators.
        </p>
      </div>

      {isExpired && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Your session has expired. Please log in again to continue.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Quick-Select Pill Box */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 space-y-2.5">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          Quick Demo Credentials (One Click Fill)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="p-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-left text-xs transition-all shadow-sm group"
          >
            <p className="font-bold text-navy-900 group-hover:text-blue-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Admin Role
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">admin@sevaqueue.org</p>
          </button>

          <button
            type="button"
            onClick={() => fillDemoCredentials('observer')}
            className="p-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-left text-xs transition-all shadow-sm group"
          >
            <p className="font-bold text-navy-900 group-hover:text-blue-700 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Observer Role
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">observer@sevaqueue.org</p>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sevaqueue.org"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500">
        Citizens do not require registration to view queue updates or browse services.{' '}
        <Link to="/" className="text-blue-700 font-bold hover:underline">
          Return to Public Homepage
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

