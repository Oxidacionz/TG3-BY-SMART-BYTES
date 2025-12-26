import React from 'react';

/**
 * Badge Component (Atom)
 * Reusable badge for status indicators
 */

export interface BadgeProps {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'neutral',
    size = 'md',
    children,
    className = ''
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full';

    const variants = {
        success: 'bg-green-900/50 text-green-300 border border-green-700',
        warning: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
        error: 'bg-red-900/50 text-red-300 border border-red-700',
        info: 'bg-blue-900/50 text-blue-300 border border-blue-700',
        neutral: 'bg-slate-800 text-slate-300 border border-slate-700'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};
