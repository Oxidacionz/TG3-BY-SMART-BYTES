import React from 'react';

/**
 * Card Component (Molecule)
 * Reusable card container with glassmorphism effect
 */

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'bordered';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    hover = false
}) => {
    const baseStyles = 'rounded-xl transition-all duration-200';

    const variants = {
        default: 'bg-slate-900 border border-slate-800',
        glass: 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50',
        bordered: 'bg-transparent border-2 border-slate-700'
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8'
    };

    const hoverStyles = hover ? 'hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 cursor-pointer' : '';

    return (
        <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}>
            {children}
        </div>
    );
};
