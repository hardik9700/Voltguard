import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  precision?: number;
  icon?: React.ReactNode;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  unit = '', 
  trend, 
  trendValue, 
  precision = 3,
  icon,
  alert = false
}) => {
  const displayValue = typeof value === 'number' ? value.toFixed(precision) : value;
  
  return (
    <div className={`p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-md ${
      alert 
        ? 'bg-red-50 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
        : 'bg-white border-slate-200 hover:border-volt-400'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon && <span className={`p-1.5 rounded-lg ${alert ? 'bg-red-100 text-red-600' : 'bg-volt-50 text-volt-600'}`}>{icon}</span>}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-mono font-medium ${alert ? 'text-red-700' : 'text-slate-900'}`}>
          {displayValue}
        </span>
        {unit && <span className="text-slate-500 text-sm font-medium">{unit}</span>}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className={`${
            trend === 'up' ? 'text-emerald-600 bg-emerald-50' : trend === 'down' ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-100'
          } flex items-center gap-1 font-medium px-2 py-0.5 rounded-full border border-current/10`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
          </span>
          <span className="text-slate-400">vs last charge</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;