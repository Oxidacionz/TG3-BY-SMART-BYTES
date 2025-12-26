import React from 'react';

/**
 * Input Component (Atom)
 * Reusable input field with error states
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    hasError = false,
    fullWidth = true,
    className = '',
    ...props
}) => {
    const baseStyles = 'px-4 py-2 rounded-lg bg-slate-800 border transition-all duration-200 text-white placeholder-slate-500 focus:outline-none focus:ring-2';

    const errorStyles = hasError
        ? 'border-red-500 focus:ring-red-500/50'
        : 'border-slate-700 focus:ring-blue-500/50 focus:border-blue-500';

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <input
            className={`${baseStyles} ${errorStyles} ${widthClass} ${className}`}
            {...props}
        />
    );
};
