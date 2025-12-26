import React, { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Icons } from '../atoms/Icons';
import { UserDropdown } from '../organisms/UserDropdown';
import { SidebarItem } from '../organisms/SidebarItem';

interface MainLayoutProps {
    children: ReactNode;
    currentView: string;
    isDarkMode: boolean;
    toggleTheme: () => void;
    onLogout: () => void;
    restartTutorial: () => void;
    isDemoMode: boolean;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    setCurrentView: (view: string) => void;
    onNewTransaction: () => void;
    onSupport: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentView,
    isDarkMode,
    toggleTheme,
    onLogout,
    restartTutorial,
    isDemoMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setCurrentView,
    onNewTransaction,
    onSupport
}) => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">

            {/* MOBILE OVERLAY */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden glass"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 z-30 transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Sidebar Background Gradient Decoration */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

                <div className="p-6 flex flex-col items-center border-b border-slate-800 relative z-10">
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white md:hidden"
                    >
                        <Icons.Close />
                    </button>

                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white relative group cursor-pointer overflow-hidden ring-2 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-slate-800">
                            <img
                                src="/TG3-BY-SMART-BYTES/gold_bull.png"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://kkkwfimgkemxwgvqvaob.supabase.co/storage/v1/object/public/assets/toro_logo.png";
                                }}
                                alt="Toro Logo"
                                className="w-full h-full object-cover scale-[1.15]"
                            />
                        </div>
                        <div>
                            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-100 font-bold text-lg leading-none">Toro Group</h2>
                            <p className="text-xs text-amber-500/80 font-medium tracking-wide">Gestión Financiera</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 smart-scanner-section relative z-10">
                    <button
                        onClick={() => { onNewTransaction(); setIsMobileMenuOpen(false); }}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] scanner-button border border-purple-400/30 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <Icons.Scan />
                        <span className="tracking-wide">Escanear / Nuevo</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-2 space-y-1 sidebar-navigation relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
                    <SidebarItem icon={<Icons.Dashboard />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Inbox />} label="Mensajes (Inbox)" active={currentView === 'inbox'} onClick={() => { setCurrentView('inbox'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Transactions />} label="Transacciones" active={currentView === 'transactions'} onClick={() => { setCurrentView('transactions'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Wallet />} label="Cuentas & Bancos" active={currentView === 'accounts'} onClick={() => { setCurrentView('accounts'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Book />} label="Libro de Cuentas" active={currentView === 'account_book'} onClick={() => { setCurrentView('account_book'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Users />} label="Clientes/Proveedores" active={currentView === 'clients'} onClick={() => { setCurrentView('clients'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Camellos />} label="Camellos" active={currentView === 'operators'} onClick={() => { setCurrentView('operators'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Notes />} label="Notas" active={currentView === 'notes'} onClick={() => { setCurrentView('notes'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Expenses />} label="Gastos" active={currentView === 'expenses'} onClick={() => { setCurrentView('expenses'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.Reports />} label="Reportes" active={currentView === 'reports'} onClick={() => { setCurrentView('reports'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<Icons.WhatsApp />} label="WhatsApp Bot" active={currentView === 'whatsapp'} onClick={() => { setCurrentView('whatsapp'); setIsMobileMenuOpen(false); }} />
                </nav>

                <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 relative z-10">
                    <button
                        onClick={() => { onSupport(); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors border border-transparent hover:border-slate-600"
                    >
                        <Icons.Support /> Soporte Técnico
                    </button>
                    <div className="mt-6 select-none pointer-events-none flex flex-col items-center justify-center w-full pb-2">
                        <span className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-light mb-0.5">Developed by</span>
                        <h1 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-80" style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontStyle: 'italic' }}>
                            SmartBytes.PF
                        </h1>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* TOP HEADER */}
                <header className="bg-white dark:bg-slate-900 h-16 border-b border-transparent flex items-center justify-between px-6 flex-shrink-0 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                    <div className="flex items-center gap-3">
                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
                        >
                            <Menu size={24} />
                        </button>

                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent capitalize drop-shadow-sm truncate max-w-[200px] md:max-w-none">
                            {currentView === 'operators' ? 'Operadores' : currentView === 'clients' ? 'Clientes / Proveedores' : currentView}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
                        </button>
                        <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors relative">
                            <Icons.Bell />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <UserDropdown onRestartTutorial={restartTutorial} onLogout={onLogout} isDemoMode={isDemoMode} />
                    </div>
                </header>

                {/* CONTENT SCROLLABLE AREA */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
};
