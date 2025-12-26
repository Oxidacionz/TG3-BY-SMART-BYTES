import React from 'react';
import { Card } from '../components/atoms/Card';
import { useFetchData } from '../hooks/useFetchData';
import { Icons } from '../components/atoms/Icons';

export const AccountBookView: React.FC = () => {
    const { data: accounts, loading: loadingAccounts } = useFetchData('/finance/accounts', []);
    const { data: transactions, loading: loadingTransactions } = useFetchData('/transactions/', []);

    const formatCurrency = (amount: number, currency: string) => {
        // Handle crypto or non-standard currencies that might crash Intl
        let safeCurrency = currency;
        if (currency === 'USDT') safeCurrency = 'USD';

        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: safeCurrency
            }).format(amount).replace('USD', currency === 'USDT' ? 'USDT' : 'USD'); // Optional: Put USDT back in string if desired, or just output $
        } catch (e) {
            return `${amount.toFixed(2)} ${currency}`;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Libro de Cuentas & Tesorería
            </h2>

            {/* Accounts Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {loadingAccounts ? (
                    <p className="text-slate-500">Cargando Cuentas...</p>
                ) : (accounts || []).map((acc: any) => (
                    <Card key={acc.id} className="p-4" variant={acc.type === 'CASH' ? 'default' : 'glass'}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-slate-800/50 text-amber-400">
                                {acc.type === 'CASH' && <Icons.Wallet />}
                                {acc.type === 'BANK' && <Icons.Bank />}
                                {acc.type === 'EWALLET' && <Icons.Zelle />}
                                {acc.type === 'CRYPTO' && <Icons.Bitcoin />}
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {acc.currency}
                            </span>
                        </div>
                        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{acc.name}</h4>
                        <p className={`text-xl font-bold mt-1 ${acc.current_balance < 0 ? 'text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {formatCurrency(acc.current_balance, acc.currency)}
                        </p>
                    </Card>
                ))}
            </div>

            {/* Transactions Table */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Movimientos Recientes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Concepto</th>
                                <th className="px-6 py-3">Plataforma</th>
                                <th className="px-6 py-3">Monto</th>
                                <th className="px-6 py-3">USD Eq.</th>
                                <th className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingTransactions ? (
                                <tr><td colSpan={6} className="text-center py-4">Cargando movimientos...</td></tr>
                            ) : (transactions || []).map((tx: any) => (
                                <tr key={tx.id} className="bg-white border-b dark:bg-slate-900 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4">
                                        {new Date(tx.created_at || tx.transaction_date).toLocaleDateString()} <br />
                                        <span className="text-xs text-slate-400">{new Date(tx.created_at || tx.transaction_date).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900 dark:text-white">{tx.category || 'General'}</p>
                                        <p className="text-xs">{tx.receiver_name ? `${tx.sender_name} -> ${tx.receiver_name}` : tx.sender_name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {tx.platform}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        <span className={tx.transaction_type === 'SALIDA' ? 'text-red-500' : 'text-green-500'}>
                                            {tx.transaction_type === 'SALIDA' ? '-' : '+'} {formatCurrency(tx.amount, tx.currency)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {formatCurrency(tx.amount_usd || 0, 'USD')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!loadingTransactions && (!transactions || transactions.length === 0) && (
                                <tr><td colSpan={6} className="text-center py-8">No hay movimientos registrados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
