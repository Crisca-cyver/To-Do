import React from 'react';

interface StatsCardProps {
  label: string;
  count: number;
  icon: string;
  iconColorClass: string;
  iconBgClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, count, icon, iconColorClass, iconBgClass }) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4 transition-transform hover:scale-[1.02] duration-200">
      <div className={`flex size-10 items-center justify-center rounded-full ${iconBgClass}`}>
        <span className={`material-symbols-outlined ${iconColorClass}`}>{icon}</span>
      </div>
      <div className="flex flex-col">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-white text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default StatsCard;