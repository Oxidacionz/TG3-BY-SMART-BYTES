import React, { useState, useMemo } from 'react';
import { Card } from '../components/atoms/Card';
import { useFetchData } from '../hooks/useFetchData';
import { Icons } from '../components/atoms/Icons';

import { Modal } from '../components/molecules/Modal';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { transactionService } from '../services/transactionService';

export const AccountBookView: React.FC = () => {
    const { data: accounts, loading: loadingAccounts, refetch: refetchAccounts } = useFetchData('/finance/accounts', []);
    const { data: transactions, loading: loadingTransactions, refetch: refetchTransactions } = useFetchData('/transactions/', []);

    // Filters
    const [filterCategory, setFilterCategory] = useState<string>('ALL');

    // Audit State
    const [isAuditModalOpen, setAuditModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<any>(null);
    const [realBalance, setRealBalance] = useState('');

    const openAudit = (account: any) => {
        setSelectedAccount(account);
        setRealBalance('');
        setAuditModalOpen(true);
    };

    const handleAuditSubmit = async () => {
        if (!selectedAccount || !realBalance) return;

        const systemBal = parseFloat(selectedAccount.current_balance || '0');
        const real = parseFloat(realBalance);
        const diff = real - systemBal;

        if (Math.abs(diff) < 0.01) {
            alert('¡Saldo cuadra perfectamente! No se requiere ajuste.');
            setAuditModalOpen(false);
            return;
        }

        const isPositive = diff > 0;

        const adjustmentTx = {
            amount: Math.abs(diff),
            currency: selectedAccount.currency,
            description: `Ajuste de Auditoría: ${selectedAccount.name}`,
            category: 'AJUSTE_AUDITORIA',
            type: isPositive ? 'ENTRADA' : 'SALIDA',
            status: 'COMPLETED',
            account_id: selectedAccount.id,
            transaction_date: new Date().toISOString(),
            rate: 1, // Base rate for same currency adjustment
            date: new Date().toISOString()
        };

        try {
            await transactionService.createTransaction(adjustmentTx);
            alert('✅ Ajuste realizado con éxito.');
            setAuditModalOpen(false);
            refetchAccounts();
            refetchTransactions();
        } catch (e) {
            console.error(e);
            alert('Error al crear ajuste.');
        }
    };

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        if (filterCategory === 'ALL') return transactions;

        return transactions.filter((tx: any) => {
            const cat = tx.category;
            if (filterCategory === 'NOMINA') return cat === 'NOMINA';
            if (filterCategory === 'GASTOS') return ['GASTO_OPERATIVO', 'PAGO_PROVEEDOR', 'RETIRO_CAPITAL'].includes(cat);
            if (filterCategory === 'CAMBIOS') return cat === 'CAMBIO_DIVISA';
            if (filterCategory === 'VENTAS') return ['VENTA', 'COBRO_DEUDA', 'INYECCION_CAPITAL'].includes(cat);
            return true;
        });
    }, [transactions, filterCategory]);

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
                        <div className="flex justify-between items-end">
                            <p className={`text-xl font-bold mt-1 ${acc.current_balance < 0 ? 'text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                {formatCurrency(acc.current_balance, acc.currency)}
                            </p>
                            <button
                                onClick={() => openAudit(acc)}
                                className="text-[10px] bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-2 py-1 rounded text-slate-500 dark:text-slate-300 transition-colors"
                                title="Realizar Arqueo"
                            >
                                <Icons.Refresh size={12} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Transactions Table */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Movimientos Recientes</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {['ALL', 'VENTAS', 'GASTOS', 'NOMINA', 'CAMBIOS'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${filterCategory === cat
                                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                    }`}
                            >
                                {cat === 'ALL' ? 'Todos' : cat}
                            </button>
                        ))}
                    </div>
                </div>
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
                            ) : (filteredTransactions || []).map((tx: any) => (
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
                                                tx.status === 'PENDING_DELIVERY' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                                                    tx.status === 'ACCOUNTS_PAYABLE' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {tx.status === 'PENDING_DELIVERY' ? 'ENTREGA PEND.' :
                                                tx.status === 'ACCOUNTS_PAYABLE' ? 'POR PAGAR' :
                                                    tx.status}
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
            {/* Audit Modal */}
            <Modal isOpen={isAuditModalOpen} onClose={() => setAuditModalOpen(false)} title="Arqueo Rápido de Cuenta">
                {selectedAccount && (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <label className="text-xs text-slate-500 font-bold uppercase">Cuenta</label>
                            <p className="font-bold text-lg dark:text-white">{selectedAccount.name}</p>
                            <div className="mt-2 flex justify-between">
                                <span className="text-sm text-slate-500">Saldo en Sistema:</span>
                                <span className="font-mono font-bold dark:text-white">
                                    {formatCurrency(selectedAccount.current_balance, selectedAccount.currency)}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Saldo Real (Bancos/Efectivo)</label>
                            <Input
                                type="number"
                                value={realBalance}
                                onChange={(e) => setRealBalance(e.target.value)}
                                placeholder="0.00"
                                className="font-mono text-lg font-bold"
                                autoFocus
                            />
                        </div>

                        {realBalance && (
                            <div className={`p-3 rounded border ${parseFloat(realBalance) - parseFloat(selectedAccount.current_balance) === 0
                                    ? 'bg-green-100 border-green-200 text-green-700'
                                    : parseInt(realBalance) > 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''
                                }`}>
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Diferencia:</span>
                                    <span>
                                        {formatCurrency(parseFloat(realBalance) - parseFloat(selectedAccount.current_balance), selectedAccount.currency)}
                                    </span>
                                </div>
                                {Math.abs(parseFloat(realBalance) - parseFloat(selectedAccount.current_balance)) > 0.01 && (
                                    <p className="text-xs mt-1">
                                        Se creará un ajuste de <strong>{parseFloat(realBalance) > parseFloat(selectedAccount.current_balance) ? 'INGRESO' : 'EGRESO'}</strong> por la diferencia.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setAuditModalOpen(false)}>Cancelar</Button>
                            <Button onClick={handleAuditSubmit}>Confirmar Ajuste</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
