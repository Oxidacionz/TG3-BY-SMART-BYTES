import React, { ReactNode } from 'react';

// 3. Card
export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
        {children}
    </div>
);
