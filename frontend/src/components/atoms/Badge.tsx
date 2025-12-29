import React from 'react';

/**
 * Badge Component (Atom)
 * Reusable badge for status indicators
 */

export interface BadgeProps {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'orange' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
    className?: string;
    status?: string; // New prop to auto-handle variants
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'neutral',
    size = 'md',
    children,
    className = '',
    status
}) => {
    let finalVariant = variant;
    let finalText = children;

    // Auto-map status if provided
    if (status) {
        finalText = status; // Default text
        if (status === 'COMPLETED') {
            finalVariant = 'success';
            finalText = 'COMPLETADO';
        } else if (status === 'PENDING') {
            finalVariant = 'warning';
            finalText = 'PENDIENTE';
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            finalVariant = 'error';
            finalText = 'FALLIDO';
        } else if (status === 'PENDING_DELIVERY') {
            finalVariant = 'orange'; // Need to add this variant
            finalText = 'ENTREGA PEND.';
        } else if (status === 'ACCOUNTS_PAYABLE') {
            finalVariant = 'purple'; // Need to add this variant
            finalText = 'POR PAGAR';
        }
    }

    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full';

    const variants: Record<string, string> = {
        success: 'bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700',
        warning: 'bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
        error: 'bg-red-100/80 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-700',
        info: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
        neutral: 'bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        orange: 'bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200 dark:border-orange-700',
        purple: 'bg-purple-100/80 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs', // Tracking says xs usually for badges
        lg: 'px-4 py-1.5 text-sm'
    };

    return (
        <span className={`${baseStyles} ${variants[finalVariant] || variants.neutral} ${sizes[size]} ${className}`}>
            {finalText}
        </span>
    );
};
