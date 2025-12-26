import React from 'react';

/**
 * Button Component (Atom)
 * Reusable button following Atomic Design principles
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30',
        ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : icon}
            {children}
        </button>
    );
};
