import React, { ReactNode } from 'react';

// 1. Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', icon, className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

    const variants = {
        primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-md shadow-blue-500/30",
        secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500",
        outline: "border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
        ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};
