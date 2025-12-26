import React from 'react';
import { Input, InputProps } from '../atoms/Input';
import { Label } from '../atoms/Label';

/**
 * FormField Component (Molecule)
 * Combines Label + Input + Error message
 */

export interface FormFieldProps extends Omit<InputProps, 'hasError'> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    helperText,
    required = false,
    id,
    ...inputProps
}) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="space-y-1">
            <Label htmlFor={fieldId} required={required}>
                {label}
            </Label>
            <Input
                id={fieldId}
                hasError={!!error}
                {...inputProps}
            />
            {error && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-xs text-slate-400">{helperText}</p>
            )}
        </div>
    );
};
