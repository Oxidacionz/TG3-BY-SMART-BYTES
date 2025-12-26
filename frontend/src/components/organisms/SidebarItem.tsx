import React, { ReactNode } from 'react';

interface SidebarItemProps {
    icon: ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative overflow-hidden group ${active
            ? 'text-white bg-gradient-to-r from-purple-900/50 to-slate-900 border-r-4 border-amber-400'
            : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50'
            }`}
    >
        {active && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent pointer-events-none" />
        )}
        <span className={`relative z-10 ${active ? 'text-amber-300 drop-shadow-sm' : ''}`}>{icon}</span>
        <span className={`relative z-10 ${active ? 'font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent' : ''}`}>{label}</span>
    </button>
);
