import React, { useEffect, useState } from 'react';
import { Icons } from '../atoms/Icons';

interface ClientLedgerProps {
    client: any;
    isDemoMode: boolean;
}

export const ClientLedger: React.FC<ClientLedgerProps> = ({ client, isDemoMode }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!client) return;

        const fetchLedger = async () => {
            setLoading(true);
            try {
                if (isDemoMode) {
                    // Mock Data
                    setTransactions([
                        { date: '2024-12-26', type: 'ENTRADA', category: 'VENTA', amount: 500, currency: 'USD', status: 'COMPLETED', desc: 'Venta Mercancía' },
                        { date: '2024-12-25', type: 'ENTRADA', category: 'COBRO_DEUDA', amount: 300, currency: 'USD', status: 'COMPLETED', desc: 'Abono Factura #123' },
                        { date: '2024-12-20', type: 'SALIDA', category: 'GASTO', amount: 1000, currency: 'USD', status: 'PENDING', desc: 'Préstamo' },
                    ]);
                } else {
                    // Real API Call
                    // Using name as fallback ID if real ID is mock-like
                    const searchId = client.name || client.id;
                    const res = await fetch(`/api/v1/transactions/client/${searchId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setTransactions(data);
                    }
                }
            } catch (e) {
                console.error("Error loading ledger", e);
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
    }, [client, isDemoMode]);

    if (!client) return null;

    // Calculate Balance
    const totalIn = transactions.filter(t => t.type === 'ENTRADA').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalOut = transactions.filter(t => t.type === 'SALIDA').reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = totalIn - totalOut;

    return (
        <div className="w-full h-full flex flex-col animate-fade-in">
            {/* Header / Summary Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {client.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{client.name}</h2>
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-mono">{client.id}</span>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Saldo Total</p>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {balance >= 0 ? '+' : ''}{balance.toFixed(2)} USD
                    </p>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                    <span>Estado de Cuenta</span>
                    {loading && <Icons.Refresh className="animate-spin text-slate-400" />}
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="p-4 border-b dark:border-slate-700">Fecha</th>
                                <th className="p-4 border-b dark:border-slate-700">Operación</th>
                                <th className="p-4 border-b dark:border-slate-700">Descripción</th>
                                <th className="p-4 border-b dark:border-slate-700 text-right">Entrada</th>
                                <th className="p-4 border-b dark:border-slate-700 text-right">Salida</th>
                                <th className="p-4 border-b dark:border-slate-700 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {transactions.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">No hay movimientos registrados</td>
                                </tr>
                            )}
                            {transactions.map((tx, i) => (
                                <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                                        {tx.date || tx.created_at?.split('T')[0]}
                                    </td>
                                    <td className="p-4 font-medium text-slate-800 dark:text-white">
                                        <div className="flex flex-col">
                                            <span>{tx.category || tx.transaction_type}</span>
                                            <span className="text-[10px] text-slate-400">{tx.platform}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                        {tx.desc || tx.description || tx.reference || '-'}
                                    </td>
                                    <td className="p-4 text-right font-mono text-green-600 font-bold">
                                        {(tx.type === 'ENTRADA' || tx.transaction_type === 'ENTRADA') ? `+${Number(tx.amount).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="p-4 text-right font-mono text-red-500 font-bold">
                                        {(tx.type === 'SALIDA' || tx.transaction_type === 'SALIDA') ? `-${Number(tx.amount).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
