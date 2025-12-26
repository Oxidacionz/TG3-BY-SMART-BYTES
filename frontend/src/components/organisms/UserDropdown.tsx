import React, { useState } from 'react';
import { Icons } from '../atoms/Icons';

interface UserDropdownProps {
    onRestartTutorial: () => void;
    onLogout: () => void;
    isDemoMode: boolean;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ onRestartTutorial, onLogout, isDemoMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm transition-colors shadow-md ${isDemoMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-800 hover:bg-brand-900 ring-2 ring-brand-600'}`}>
                {isDemoMode ? (
                    <div className="relative flex items-center justify-center">
                        <Icons.Camel />
                        <span className="absolute -bottom-2 -right-3 bg-white text-amber-600 text-[9px] font-bold px-1 rounded-full border border-amber-500 shadow-sm">
                            #1
                        </span>
                    </div>
                ) : (
                    <Icons.Toro />
                )}
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1 animate-fade-in-down">
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{isDemoMode ? 'Operador Invitado' : 'ToroPrincipal'}</p>
                            <p className={`text-xs font-bold ${isDemoMode ? 'text-amber-500' : 'text-brand-500'}`}>{isDemoMode ? 'CAMELLO / GUEST' : 'ADMIN'}</p>
                            <p className="text-xs text-slate-500">{isDemoMode ? 'Entorno de Pruebas' : 'Oficina Principal'}</p>
                        </div>
                        {!isDemoMode && (
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                                <Icons.Users /> Configuración
                            </button>
                        )}
                        <button onClick={() => { setIsOpen(false); onRestartTutorial(); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                            <span className="text-amber-500">✨</span> Ver Tutorial Interactivo
                        </button>
                        <div className="border-t border-slate-200 dark:border-slate-700 mt-1"></div>
                        <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
