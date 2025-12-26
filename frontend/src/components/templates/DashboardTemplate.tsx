import React from 'react';

/**
 * DashboardTemplate Component (Template)
 * 
 * Template for dashboard-style layouts with stats section and main content area.
 * Provides consistent spacing and responsive grid layout.
 * 
 * @example
 * ```tsx
 * <DashboardTemplate
 *   stats={<DashboardStats transactions={data} />}
 *   actions={<Button onClick={handleNew}>New Transaction</Button>}
 * >
 *   <TransactionList transactions={data} />
 * </DashboardTemplate>
 * ```
 */

export interface DashboardTemplateProps {
    /** Statistics/metrics section at the top */
    stats?: React.ReactNode;
    /** Action buttons or controls */
    actions?: React.ReactNode;
    /** Main dashboard content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Maximum width constraint */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
    stats,
    actions,
    children,
    className = '',
    maxWidth = '2xl'
}) => {
    const maxWidthClasses = {
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-5xl',
        xl: 'max-w-6xl',
        '2xl': 'max-w-7xl',
        full: 'max-w-full'
    };

    return (
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-10 ${className}`}>
            {/* Stats Section */}
            {stats && (
                <div className="mb-8 animate-in fade-in duration-500">
                    {stats}
                </div>
            )}

            {/* Actions Bar */}
            {actions && (
                <div className="flex items-center justify-between mb-6">
                    {actions}
                </div>
            )}

            {/* Main Content */}
            <div className="animate-in fade-in duration-700 delay-100">
                {children}
            </div>
        </div>
    );
};
