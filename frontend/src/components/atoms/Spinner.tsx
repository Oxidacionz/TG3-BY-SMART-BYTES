import React from 'react';

/**
 * Spinner Component (Atom)
 * Reusable loading spinner
 */

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'blue' | 'white' | 'green' | 'red';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'blue',
    className = ''
}) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    const colors = {
        blue: 'border-blue-600',
        white: 'border-white',
        green: 'border-green-600',
        red: 'border-red-600'
    };

    return (
        <svg
            className={`animate-spin ${sizes[size]} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className={`opacity-75 ${colors[color]}`}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
};
