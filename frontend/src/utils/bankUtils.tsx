import React from 'react';
import { Icons } from '../components/atoms/Icons';

export const getBankStyle = (bankName: string) => {
    const norm = bankName.toLowerCase();
    if (norm.includes('binance')) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black border-yellow-500 shadow-yellow-200';
    if (norm.includes('zelle')) return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white border-purple-500 shadow-purple-200';
    if (norm.includes('banesco')) return 'bg-gradient-to-br from-green-500 to-green-700 text-white border-green-500 shadow-green-200';
    if (norm.includes('mercantil')) return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-600 shadow-blue-200';
    if (norm.includes('paypal')) return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-400 shadow-blue-200';
    if (norm.includes('chase')) return 'bg-gradient-to-br from-blue-800 to-slate-900 text-white border-blue-800 shadow-blue-200';
    return 'bg-gradient-to-br from-slate-500 to-slate-700 text-white';
};

export const getBankIcon = (bankName: string) => {
    const norm = bankName.toLowerCase();
    if (norm.includes('binance')) return <Icons.Refresh />; // Placeholder for Binance
    if (norm.includes('zelle')) return <Icons.Send />;
    if (norm.includes('banesco')) return <span className="font-bold text-lg">B</span>;
    if (norm.includes('mercantil')) return <span className="font-bold text-lg">M</span>;
    if (norm.includes('paypal')) return <span className="font-bold text-lg">P</span>;
    return <Icons.Wallet />;
};
