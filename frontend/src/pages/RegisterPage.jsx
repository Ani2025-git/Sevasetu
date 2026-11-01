import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Landmark
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(
        formData.fullName.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword
      );

      if (res.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please check your information and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-xs p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <img
              src="/assets/brand/seva-setu-logo.png"
              alt="Seva Setu Logo"
              className="h-14 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-xl font-bold text-[#173B72]">
            Create Citizen Account
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Join Seva Setu to save certificate checklists and track your preparation progress.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-indiaGreen-50 border border-indiaGreen-200 rounded-lg p-3 flex items-center gap-2.5 text-xs text-indiaGreen font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-indiaGreen" />
            <span>{success}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Subhashish Roy"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-digital text-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="citizen@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-digital text-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-digital text-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-digital text-navy"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-digital hover:bg-digital-600 text-white text-xs sm:text-sm font-bold py-2.5 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Citizen Account...</span>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <div className="flex items-start gap-2 bg-surface p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-indiaGreen shrink-0 mt-0.5" />
          <span>
            Citizen privacy pledge: We never collect Aadhaar numbers, phone OTPs, or financial information.
          </span>
        </div>

        {/* Link to login */}
        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-digital font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
