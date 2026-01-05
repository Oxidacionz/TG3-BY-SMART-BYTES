import React, { ReactNode } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../../components/atoms/Card';
import { Icons } from '../../../components/atoms/Icons';
import { StatCard } from '../../../components/molecules/StatCard';
import { RatesWithClock } from '../../../components/molecules/RatesWithClock';
import { Stats } from '../../../types';


interface DashboardViewProps {
    stats: Stats;
    chartType: 'line' | 'bar' | 'pie';
    setChartType: (type: 'line' | 'bar' | 'pie') => void;
    isDemoMode: boolean;
    onRefreshRates: () => void;
    isRefreshingRates: boolean;
    onNavigateToAccountBook: () => void;
    recentTransactions: any[];
}

import { AdvisorModal } from '../../../components/organisms/AdvisorModal';
import { useState, useMemo } from 'react';

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, chartType, setChartType, isDemoMode, onRefreshRates, isRefreshingRates, onNavigateToAccountBook, recentTransactions = [] }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

    // Filter transactions for "Today"
    const todayTransactions = useMemo(() => {
        const now = new Date();
        const todayStr = now.toDateString();

        return recentTransactions.filter(tx => {
            // Handle both ISO strings and Date objects if necessary, assuming ISO from backend/mock
            const txDate = new Date(tx.created_at || tx.transaction_date || tx.date);
            return txDate.toDateString() === todayStr;
        }).sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime());
    }, [recentTransactions]);

    return (
        <div className="space-y-6 animate-fade-in relative">
            <AdvisorModal isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />

            {/* Ticker Tape */}
            {/* ... Ticker content ... */}
            {/* Ticker Tape with Clock */}
            <RatesWithClock
                ticker={stats?.ticker}
                onRefresh={onRefreshRates}
                isRefreshing={isRefreshingRates}
            />



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Volumen Total" value={`${stats?.volume || '0.00'}`} subtext="+12% vs mes pasado" icon={<Icons.Transactions />} color="blue" />
                <StatCard title="Ganancia Neta" value={`${stats?.net_profit || '0.00'}`} subtext="+5.4% rendimiento" icon={<Icons.Wallet />} color="green" />
                <StatCard title="Pendientes" value={`${stats?.pending_count || 0}`} subtext="Requieren atención" icon={<Icons.Bell />} color="yellow" />
                <StatCard
                    title="Asesor Financiero"
                    value="Profesor Toro"
                    subtext="Click Para Hablar"
                    icon={
                        <div className="relative w-24 h-24 -mt-6">
                            <img src="/TG3-BY-SMART-BYTES/assets/ai-advisor.png" alt="AI Advisor" className="w-full h-full object-contain drop-shadow-md filter brightness-110" />
                        </div>
                    }
                    color="purple"
                    onClick={() => setIsAdvisorOpen(true)}
                    className="hover:scale-105 transition-transform cursor-pointer ring-2 ring-transparent hover:ring-indigo-500"
                    reverseLayout={true}
                />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 !p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">Rendimiento en Tiempo Real</h3>
                            <p className="text-xs text-slate-500">Volumen vs. Ganancia (Últimos 7 días)</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-0.5">
                            <button onClick={() => setChartType('line')} className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${chartType === 'line' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Línea</button>
                            <button onClick={() => setChartType('bar')} className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${chartType === 'bar' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Barras</button>
                            <button onClick={() => setChartType('pie')} className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${chartType === 'pie' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Circular</button>
                        </div>
                    </div>

                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={stats?.chart_data || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                    />
                                    <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                                </LineChart>
                            ) : chartType === 'bar' ? (
                                <BarChart data={stats?.chart_data || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                    />
                                    <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={stats?.chart_data || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="volume"
                                    >
                                        {(stats?.chart_data || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Right Sidebar: Activity */}
                <div className="space-y-4">
                    <Card className="!p-4 flex flex-col h-full relative">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">Actividad de Hoy</h3>
                            <button onClick={onNavigateToAccountBook} className="text-[10px] text-indigo-500 hover:text-indigo-600 font-bold">Ver Todo</button>
                        </div>

                        <div className="flex-1 space-y-3">
                            {todayTransactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
                                    <Icons.Clock size={24} className="mb-2 opacity-50" />
                                    <p>No hay movimientos hoy</p>
                                </div>
                            ) : (
                                todayTransactions.slice(0, 4).map((tx, i) => (
                                    <div key={i} className="flex gap-2.5 items-start pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 ${tx.type === 'ENTRADA' ? 'bg-green-500' : tx.type === 'SALIDA' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                            {tx.type === 'ENTRADA' ? <Icons.ArrowUpRight size={14} /> : tx.type === 'SALIDA' ? <Icons.ArrowDownRight size={14} /> : <Icons.Transactions size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-800 dark:text-white leading-tight">
                                                {tx.category || 'Transacción'}
                                                <span className={`font-bold ml-1 ${tx.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'ENTRADA' ? '+' : '-'}{tx.amount} {tx.currency}
                                                </span>
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {new Date(tx.created_at || tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.client || tx.receiver_name || 'General'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Navigation Bubble if more items exist */}
                        {todayTransactions.length > 4 && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={onNavigateToAccountBook}
                                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-1.5 px-4 rounded-full transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <Icons.Book size={12} />
                                    Ver {todayTransactions.length - 4} más de hoy
                                </button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
