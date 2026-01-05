import React, { useState } from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Icons } from '../components/atoms/Icons';
import { Wallet } from 'lucide-react'; // Fallback import

import { getBankStyle, getBankIcon } from '../utils/bankUtils';
import { useFetchData } from '../hooks/useFetchData';
import { AddAccountModal } from '../components/organisms/AddAccountModal';

export const AccountsView: React.FC = () => {
    const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

    // Fetch data from backend
    const { data: accounts = [] } = useFetchData('/finance/accounts', []);

    // Filter accounts by currency
    const nationalAccounts = accounts.filter((acc: any) => acc.currency === 'VES');
    const internationalAccounts = accounts.filter((acc: any) => acc.currency !== 'VES');

    // Fallback Mock for immediate visual if backend is empty (Optional / Temporary)
    // Only used if TOTAL accounts is 0 to show something on screen
    const showMocks = accounts.length === 0;

    const displayInternational = showMocks ? [
        { name: 'Binance', type: 'USDT', balance: '0.00', count: 0, currency: 'USDT' },
        { name: 'Zelle', type: 'USD', balance: '0.00', count: 0, currency: 'USD' }
    ] : internationalAccounts;

    const displayNational = showMocks ? [
        { name: 'Banco de Venezuela', type: 'BANK', balance: '0.00', count: 0, currency: 'VES' }
    ] : nationalAccounts;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsAddAccountModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-300 text-xs font-bold rounded-lg transition-all hover:text-amber-500 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 group"
                >
                    <div className="group-hover:text-amber-500 transition-colors"><Icons.Plus size={16} /></div>
                    Agregar Cuenta
                </button>
            </div>

            <AddAccountModal isOpen={isAddAccountModalOpen} onClose={() => setIsAddAccountModalOpen(false)} />

            {/* International & Crypto Separator */}
            <div className="relative flex py-5 items-center">
                <span className="flex-shrink-0 mr-4 text-xs font-bold px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600">
                    Billeteras & Bancos Int.
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {displayInternational.map((bank: any) => (
                    <Card key={bank.name} className={`px-3 py-2.5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-2 ${getBankStyle(bank.name).split(' ')[0].replace('bg-gradient-to-br', 'border-t-transparent')}`}>
                        {/* Background Decoration */}
                        <div className={`absolute inset-0 opacity-10 ${getBankStyle(bank.name)}`}></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className={`p-1.5 rounded-md shadow-sm shrink-0 ${getBankStyle(bank.name)}`}>
                                        {React.cloneElement(getBankIcon(bank.name) as React.ReactElement, { size: 14 })}
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate leading-tight" title={bank.name}>{bank.name}</h4>
                                </div>
                                <div className="bg-white/90 dark:bg-slate-900/90 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-bold border border-slate-200 shadow-sm shrink-0">
                                    {bank.type}
                                </div>
                            </div>

                            <div className="flex items-end justify-between mt-1">
                                <div>
                                    <p className="text-sm font-black text-slate-800 dark:text-white leading-none tracking-tight">{bank.current_balance || bank.balance} <span className="text-[9px] font-normal text-slate-500">{bank.currency || bank.type}</span></p>
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium">--</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* National Separator */}
            <div className="relative flex py-5 items-center mt-6">
                <span className="flex-shrink-0 mr-4 text-xs font-bold px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600">
                    Bancos Nacionales (VES)
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {displayNational.map((bank: any) => (
                    <Card key={bank.name} className={`px-3 py-2.5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-2 ${getBankStyle(bank.name).split(' ')[0].replace('bg-gradient-to-br', 'border-t-transparent')}`}>
                        {/* Background Decoration */}
                        <div className={`absolute inset-0 opacity-10 ${getBankStyle(bank.name)}`}></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className={`p-1.5 rounded-md shadow-sm shrink-0 ${getBankStyle(bank.name)}`}>
                                        {React.cloneElement(getBankIcon(bank.name) as React.ReactElement, { size: 14 })}
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate leading-tight" title={bank.name}>{bank.name}</h4>
                                </div>
                                <div className="bg-white/90 dark:bg-slate-900/90 text-yellow-600 px-1.5 py-0.5 rounded text-[8px] font-bold border border-yellow-200 shadow-sm shrink-0">
                                    {bank.type}
                                </div>
                            </div>

                            <div className="flex items-end justify-between mt-1">
                                <div>
                                    <p className="text-sm font-black text-slate-800 dark:text-white leading-none tracking-tight">{bank.current_balance || bank.balance} <span className="text-[9px] font-normal text-slate-500">{bank.type}</span></p>
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium">--</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
