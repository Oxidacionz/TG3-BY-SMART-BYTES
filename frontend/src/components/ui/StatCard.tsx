import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red' | string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon, color }) => {
    const getColors = (c: string) => {
        switch (c) {
            case 'blue': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'green': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'yellow': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
            case 'red': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300`}>
                {/* Large Background Icon */}
                <div className="scale-[2.5]">{icon}</div>
            </div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${getColors(color)}`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
                <span className="font-medium text-green-500 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                    {subtext.split(' ')[0]}
                </span>
                <span className="text-slate-400">{subtext.split(' ').slice(1).join(' ')}</span>
            </div>
        </div>
    );
};
