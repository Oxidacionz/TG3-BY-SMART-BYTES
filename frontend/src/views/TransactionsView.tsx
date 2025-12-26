import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Icons } from '../components/atoms/Icons';
import { Input } from '../components/atoms/Input';

import { Transaction } from '../types';

interface TransactionsViewProps {
    transactions: Transaction[];
    onNewTransaction: () => void;
    isDemoMode: boolean;
    demoTransactions: Transaction[];
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, onNewTransaction, isDemoMode, demoTransactions }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Transacciones Recientes</h2>
                    <p className="text-sm text-slate-500">Historial completo de movimientos.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input placeholder="Buscar por referencia..." className="w-full md:w-64" />
                    <Button icon={<Icons.Plus />} onClick={onNewTransaction}>Nueva</Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">ID / FECHA</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">CLIENTE / BANCO</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">MONTO / TIPO</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">OPERADOR</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">BENEFICIO</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">ESTADO</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 text-center">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(transactions || []).length === 0 && !isDemoMode ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-slate-500">
                                        No hay transacciones registradas.
                                    </td>
                                </tr>
                            ) : (isDemoMode ? [...demoTransactions] : (transactions || [])).map((tx: any) => {
                                const op = { name: 'Camello Alpha', avatar: '🐫', color: 'bg-blue-100 text-blue-700' }; // Placeholder for map
                                return (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{tx.id}</div>
                                            <div className="text-xs text-slate-400">{tx.date}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800 dark:text-white">{tx.client}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                {tx.clientBank || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`p-1 rounded ${tx.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {tx.type === 'ENTRADA' ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>}
                                                </span>
                                                <span className="font-bold">{tx.amount} {tx.currency}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${op ? op.color : 'bg-slate-200 dark:bg-slate-700'}`}>
                                                    {op ? op.avatar : (tx.operator ? tx.operator.charAt(0) : '?')}
                                                </div>
                                                <span className="text-xs font-medium">{tx.operator}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-slate-500">Tasa: {tx.rate}</div>
                                            <div className="text-green-600 text-xs font-bold">+{tx.profit} USD</div>
                                        </td>
                                        <td className="px-6 py-4"><Badge status={tx.status} /></td>
                                        <td className="px-6 py-4 text-center text-slate-400">
                                            <button className="p-1 hover:text-brand-500 transition-colors"><Icons.Edit /></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
