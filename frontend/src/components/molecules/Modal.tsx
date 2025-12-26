import React, { ReactNode } from 'react';
import { Icons } from '../atoms/Icons';

// 5. Modal
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    const widthClass = size === 'xl' ? 'max-w-[50rem]' : size === 'lg' ? 'max-w-4xl' : size === 'sm' ? 'max-w-md' : 'max-w-2xl';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full ${widthClass} border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]`}>
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icons.Close />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
