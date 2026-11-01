import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
  User,
  Landmark
} from 'lucide-react';

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
          navigate('/dashboard');
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
      setEmail('admin@sevasetu.org');
      setPassword('Admin@123');
    } else if (role === 'observer') {
      setEmail('observer@sevasetu.org');
      setPassword('Observer@123');
    } else {
      setEmail('citizen@sevasetu.org');
      setPassword('Citizen@123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <Link to="/" className="inline-block">
          <img
            src="/assets/brand/seva-setu-logo.png"
            alt="Seva Setu Logo"
            className="h-14 w-auto mx-auto object-contain"
          />
        </Link>
        <h1 className="text-xl font-bold text-[#173B72]">Sign In to Your Account</h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Access your saved checklists, observer reports, or administration panel.
        </p>
      </div>

      {isExpired && (
        <div className="p-3 bg-saffron-50 border border-saffron-200 text-saffron-900 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-saffron shrink-0" />
          <span>Your session has expired. Please sign in again to continue.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Quick-Select Pill Box */}
      <div className="bg-surface border border-slate-200 rounded-xl p-3.5 space-y-2">
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-digital" />
          Demo Access Credentials (One Click Fill)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('citizen')}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-digital text-left text-xs transition-colors shadow-2xs"
          >
            <p className="font-bold text-navy flex items-center gap-1 text-[11px]">
              <User className="w-3 h-3 text-digital" /> Citizen
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">citizen@sevasetu.org</p>
          </button>

          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-digital text-left text-xs transition-colors shadow-2xs"
          >
            <p className="font-bold text-navy flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3 h-3 text-saffron" /> Admin
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">admin@sevasetu.org</p>
          </button>

          <button
            type="button"
            onClick={() => fillDemoCredentials('observer')}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-digital text-left text-xs transition-colors shadow-2xs"
          >
            <p className="font-bold text-navy flex items-center gap-1 text-[11px]">
              <UserCheck className="w-3 h-3 text-indiaGreen" /> Observer
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">observer@sevasetu.org</p>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@sevasetu.org"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-digital text-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-digital text-navy"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg bg-digital hover:bg-digital-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-digital font-bold hover:underline">
              Create a Citizen Account
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        Registration is optional for citizens browsing services.{' '}
        <Link to="/" className="text-digital font-bold hover:underline">
          Return to Homepage
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
