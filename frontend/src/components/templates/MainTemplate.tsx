import React from 'react';

/**
 * MainTemplate Component (Template)
 * 
 * Main application layout template that provides consistent structure
 * across the application with header, main content area, and optional footer.
 * 
 * @example
 * ```tsx
 * <MainTemplate
 *   header={<Header onNewScan={handleNewScan} />}
 *   footer={<Footer />}
 * >
 *   <DashboardView />
 * </MainTemplate>
 * ```
 */

export interface MainTemplateProps {
    /** Header component to display at the top */
    header?: React.ReactNode;
    /** Main content to display in the body */
    children: React.ReactNode;
    /** Optional footer component */
    footer?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Background color variant */
    bgVariant?: 'dark' | 'darker' | 'gradient';
}

export const MainTemplate: React.FC<MainTemplateProps> = ({
    header,
    children,
    footer,
    className = '',
    bgVariant = 'darker'
}) => {
    const bgVariants = {
        dark: 'bg-slate-900',
        darker: 'bg-[#020617]',
        gradient: 'bg-gradient-to-br from-slate-900 via-[#020617] to-slate-900'
    };

    return (
        <div className={`min-h-screen ${bgVariants[bgVariant]} text-slate-300 flex flex-col ${className}`}>
            {/* Header */}
            {header && (
                <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/80 border-b border-slate-800">
                    {header}
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer */}
            {footer && (
                <footer className="border-t border-slate-800 bg-slate-900/50">
                    {footer}
                </footer>
            )}
        </div>
    );
};
