import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export const getStatusConfig = (status, isStale = false) => {
  if (isStale || status === 'UNKNOWN' || !status) {
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      badgeBg: 'bg-slate-200 text-slate-800',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
      text: 'text-slate-700',
      icon: HelpCircle,
      label: isStale ? 'No Recent Update' : 'Status Unknown',
      desc: 'No recent verified observations available.',
      colorHex: '#64748b'
    };
  }

  switch (status.toUpperCase()) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        border: 'border-emerald-300',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
        icon: CheckCircle2,
        label: 'Low Queue',
        desc: 'Generally short or no waiting time observed.',
        colorHex: '#10b981'
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800',
        border: 'border-amber-300',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        icon: AlertTriangle,
        label: 'Moderate Queue',
        desc: 'Steady queue observed; some waiting expected.',
        colorHex: '#f59e0b'
      };
    case 'HIGH':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        badgeBg: 'bg-rose-100 text-rose-800',
        border: 'border-rose-300',
        dot: 'bg-rose-500',
        text: 'text-rose-700',
        icon: AlertCircle,
        label: 'High Queue',
        desc: 'Significant crowd observed. Longer wait times likely.',
        colorHex: '#ef4444'
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        badgeBg: 'bg-slate-200 text-slate-800',
        border: 'border-slate-300',
        dot: 'bg-slate-400',
        text: 'text-slate-700',
        icon: HelpCircle,
        label: 'Unknown',
        desc: 'No recent status available.',
        colorHex: '#64748b'
      };
  }
};

const QueueBadge = ({ status, isStale = false, size = 'md', showIcon = true }) => {
  const config = getStatusConfig(status, isStale);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full ${config.dot} ${!isStale && status !== 'UNKNOWN' ? 'animate-pulse' : ''}`} />
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
};

export default QueueBadge;

