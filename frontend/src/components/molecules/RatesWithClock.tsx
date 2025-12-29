import React, { useState, useEffect } from 'react';
import { Icons } from '../atoms/Icons';

interface TickerData {
    global_rate?: string | number;
    bcv_usd?: string | number;
    bcv_eur?: string | number;
    binance_buy?: string | number;
    zelle?: string | number;
}

interface RatesWithClockProps {
    ticker?: TickerData;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export const RatesWithClock: React.FC<RatesWithClockProps> = ({ ticker, onRefresh, isRefreshing }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dateStr = time.toLocaleDateString("es-VE", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    // 12-hour format display
    const timeStr = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
    });

    return (
        <div className="bg-slate-900 text-white p-2.5 overflow-hidden whitespace-nowrap relative rounded-lg shadow-inner flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono border border-slate-700/50">
            {/* Rates Section */}
            <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto scrollbar-hide px-2">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                    TORO GROUP
                </span>

                <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded">
                    <span className="text-slate-400">GLOBAL:</span>
                    <span className="text-green-400 font-bold">{ticker?.global_rate || '---'}</span>
                </span>

                <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded">
                    <span className="text-slate-400">BCV:</span>
                    <span className="font-bold text-white">{ticker?.bcv_usd || '---'}</span>
                </span>

                <span className="flex items-center gap-1 hidden lg:flex bg-slate-800/50 px-2 py-0.5 rounded">
                    <span className="text-slate-400">EUR:</span>
                    <span className="font-bold text-slate-300">{ticker?.bcv_eur || '---'}</span>
                </span>

                <span className="flex items-center gap-1 hidden xl:flex bg-slate-800/50 px-2 py-0.5 rounded">
                    <span className="text-slate-400">BINANCE:</span>
                    <span className="text-yellow-400 font-bold">{ticker?.binance_buy || '---'}</span>
                </span>
            </div>

            {/* Clock & Refresh Section */}
            <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-slate-700/50">
                <div className="flex flex-col items-end leading-none">
                    <span className="font-bold text-sm text-indigo-300 uppercase">{dateStr}</span>
                    <span className="text-xl font-bold font-digital text-white tracking-widest">{timeStr}</span>
                </div>

                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 ${isRefreshing ? 'animate-spin text-amber-500' : 'text-slate-400 hover:text-white'}`}
                    title="Actualizar Tasas"
                >
                    <Icons.Refresh size={16} />
                </button>
            </div>
        </div>
    );
};
