import React from 'react';

/**
 * Label Component (Atom)
 * Reusable label for form fields
 */

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
    required = false,
    children,
    className = '',
    ...props
}) => {
    return (
        <label
            className={`block text-sm font-semibold text-slate-300 mb-1 ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};
