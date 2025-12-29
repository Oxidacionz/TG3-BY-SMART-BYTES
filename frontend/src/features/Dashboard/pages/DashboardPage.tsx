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
}

import { AdvisorModal } from '../../../components/organisms/AdvisorModal';
import { useState } from 'react';

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, chartType, setChartType, isDemoMode, onRefreshRates, isRefreshingRates }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Rendimiento en Tiempo Real</h3>
                            <p className="text-sm text-slate-500">Volumen vs. Ganancia (Últimos 7 días)</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
                            <button onClick={() => setChartType('line')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartType === 'line' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Línea</button>
                            <button onClick={() => setChartType('bar')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartType === 'bar' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Barras</button>
                            <button onClick={() => setChartType('pie')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartType === 'pie' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Circular</button>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={stats?.chart_data || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                    />
                                    <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                                </LineChart>
                            ) : chartType === 'bar' ? (
                                <BarChart data={stats?.chart_data || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="volume"
                                    >
                                        {(stats?.chart_data || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Right Sidebar: Activity */}
                <div className="space-y-6">
                    <Card className="p-6 flex flex-col h-full">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Actividad Reciente</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div key={i} className="flex gap-3 items-start pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${['bg-green-500', 'bg-blue-500', 'bg-amber-500'][i % 3]}`}>
                                        <Icons.Transactions />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Nueva transacción <span className="font-bold">+{100 * (i + 1)} USD</span></p>
                                        <p className="text-xs text-slate-400">Hace {5 * (i + 1)} min • Zelle</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
