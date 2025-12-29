import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'glass'; // Added variant since StatCard uses it, though it wasn't in original Card definition it might be used elsewhere or just ignored before. StatCard passes variant="glass"
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
    <div
        className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
        onClick={onClick}
    >
        {children}
    </div>
);
