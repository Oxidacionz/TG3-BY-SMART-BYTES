import React, { useEffect } from 'react';
import { Button } from '../atoms/Button';

/**
 * ModalTemplate Component (Template)
 * 
 * Reusable modal template with backdrop, header, content, and footer sections.
 * Handles escape key to close and click outside to close functionality.
 * 
 * @example
 * ```tsx
 * <ModalTemplate
 *   isOpen={isModalOpen}
 *   onClose={handleClose}
 *   title="New Transaction"
 *   footer={<Button onClick={handleSubmit}>Submit</Button>}
 * >
 *   <TransactionForm />
 * </ModalTemplate>
 * ```
 */

export interface ModalTemplateProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal should close */
    onClose: () => void;
    /** Modal title */
    title?: string;
    /** Main modal content */
    children: React.ReactNode;
    /** Footer content (usually buttons) */
    footer?: React.ReactNode;
    /** Modal size */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Whether clicking backdrop closes modal */
    closeOnBackdrop?: boolean;
    /** Whether pressing ESC closes modal */
    closeOnEscape?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export const ModalTemplate: React.FC<ModalTemplateProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4'
    };

    // Handle ESC key
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={`relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full ${sizeClasses[size]} animate-in zoom-in-95 duration-200 ${className}`}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-slate-800">
                        <h2 className="text-2xl font-black text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
