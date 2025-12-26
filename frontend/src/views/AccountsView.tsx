import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Icons } from '../components/atoms/Icons';
import { Wallet } from 'lucide-react'; // Fallback import

import { getBankStyle, getBankIcon } from '../utils/bankUtils';

export const AccountsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant="secondary" icon={<Icons.Plus />}>Agregar Cuenta</Button>
            </div>

            {/* International & Crypto */}
            <div className="border-l-4 border-brand-500 pl-4 mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Billeteras & Bancos Int.</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                    { name: 'Binance', type: 'USDT', balance: '14,250.80', count: 1 },
                    { name: 'Zelle', type: 'USD', balance: '5,100.00', count: 3 },
                    { name: 'Banesco Panama', type: 'USD', balance: '8,420.50', count: 1 },
                    { name: 'Chase', type: 'USD', balance: '12,000.00', count: 1 },
                    { name: 'PayPal', type: 'USD', balance: '1,240.00', count: 1 },
                    { name: 'Mercantil', type: 'USD', balance: '3,500.00', count: 1 },
                    { name: 'Swift', type: 'USD', balance: '25,000.00', count: 1 },
                ].map((bank) => (
                    <Card key={bank.name} className={`p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 ${getBankStyle(bank.name).split(' ')[0].replace('bg-gradient-to-br', 'border-t-transparent')}`}>
                        {/* Background Decoration */}
                        <div className={`absolute inset-0 opacity-10 ${getBankStyle(bank.name)}`}></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl shadow-lg ${getBankStyle(bank.name)}`}>
                                    {getBankIcon(bank.name)}
                                </div>
                                <div className="bg-white/90 dark:bg-slate-900/90 text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 shadow-sm">
                                    {bank.type}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{bank.name}</h4>
                            <p className="text-xs text-slate-500 mb-6">{bank.count} Cuenta{bank.count > 1 ? 's' : ''}</p>
                            <div className="border-t border-slate-200 dark:border-slate-700/50 pt-2">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Saldo Total</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">{bank.balance} <span className="text-xs font-normal text-slate-500">{bank.type}</span></p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* National */}
            <div className="border-l-4 border-yellow-500 pl-4 mb-4 mt-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Bancos Nacionales (VES)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                    { name: 'Banco de Venezuela', type: 'VES', balance: '45,200.00', count: 2 },
                ].map((bank) => (
                    <Card key={bank.name} className={`p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t-4 border-red-500`}>
                        <div className={`absolute inset-0 opacity-10 bg-red-600`}></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl shadow-lg bg-red-600 text-white`}>
                                    <span className="font-bold">BV</span>
                                </div>
                                <div className="bg-white/90 dark:bg-slate-900/90 text-yellow-600 px-2 py-1 rounded text-[10px] font-bold border border-yellow-200 shadow-sm">
                                    {bank.type}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{bank.name}</h4>
                            <p className="text-xs text-slate-500 mb-6">{bank.count} Cuenta{bank.count > 1 ? 's' : ''}</p>
                            <div className="border-t border-slate-200 dark:border-slate-700/50 pt-2">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Saldo Total</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">{bank.balance} <span className="text-xs font-normal text-slate-500">{bank.type}</span></p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
