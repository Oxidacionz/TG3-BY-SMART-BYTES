import React, { useState, useMemo } from 'react';
import { Card } from '../components/atoms/Card';
import { useFetchData } from '../hooks/useFetchData';
import { Icons } from '../components/atoms/Icons';

import { StatCard } from '../components/molecules/StatCard';
import { Modal } from '../components/molecules/Modal';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { transactionService } from '../services/transactionService';

interface AccountBookViewProps {
    isDemoMode?: boolean;
    demoTransactions?: any[];
}

export const AccountBookView: React.FC<AccountBookViewProps> = ({ isDemoMode = false, demoTransactions = [] }) => {
    const { data: accounts, loading: loadingAccounts, refetch: refetchAccounts } = useFetchData('/finance/accounts', []);
    const { data: apiTransactions, loading: loadingApiTransactions, refetch: refetchTransactions } = useFetchData('/transactions/?limit=1000', []);

    // Map demo transactions to view schema
    const transactions = useMemo(() => {
        if (isDemoMode) {
            return demoTransactions.map(t => ({
                id: t.id,
                created_at: new Date().toISOString(), // Use current time for better date filtering demo
                transaction_date: new Date().toISOString(),
                category: t.type === 'ENTRADA' ? 'VENTA' : 'GASTO_OPERATIVO',
                receiver_name: t.type === 'SALIDA' ? t.client : 'Toro Group',
                sender_name: t.type === 'ENTRADA' ? t.client : 'Toro Group',
                platform: t.clientBank,
                transaction_type: t.type,
                amount: parseFloat(t.amount),
                currency: t.currency,
                amount_usd: t.currency === 'USD' ? parseFloat(t.amount) : parseFloat(t.amount) * 1.02, // Mock rate
                status: 'COMPLETED'
            }));
        }
        return apiTransactions;
    }, [isDemoMode, demoTransactions, apiTransactions]);

    const loadingTransactions = isDemoMode ? false : loadingApiTransactions;

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

    const [dateFilterType, setDateFilterType] = useState<'ALL_TIME' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>('ALL_TIME');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        let result = transactions;

        // Date Filters
        if (dateFilterType !== 'ALL_TIME') {
            result = result.filter((tx: any) => {
                const txDate = new Date(tx.created_at || tx.transaction_date);
                // Check valid date
                if (isNaN(txDate.getTime())) return false;

                if (dateFilterType === 'DAY') {
                    return txDate.toDateString() === selectedDate.toDateString();
                } else if (dateFilterType === 'MONTH') {
                    return txDate.getMonth() === selectedDate.getMonth() && txDate.getFullYear() === selectedDate.getFullYear();
                } else if (dateFilterType === 'YEAR') {
                    return txDate.getFullYear() === selectedDate.getFullYear();
                } else if (dateFilterType === 'WEEK') {
                    // Simple week check (same week number and year)
                    const getWeek = (d: Date) => {
                        const date = new Date(d.getTime());
                        date.setHours(0, 0, 0, 0);
                        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
                        const week1 = new Date(date.getFullYear(), 0, 4);
                        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
                    };
                    return getWeek(txDate) === getWeek(selectedDate) && txDate.getFullYear() === selectedDate.getFullYear();
                }
                return true;
            });
        }

        // Category Filter
        if (filterCategory !== 'ALL') {
            result = result.filter((tx: any) => {
                const cat = tx.category;
                if (filterCategory === 'NOMINA') return cat === 'NOMINA';
                if (filterCategory === 'GASTOS') return ['GASTO_OPERATIVO', 'PAGO_PROVEEDOR', 'RETIRO_CAPITAL'].includes(cat);
                if (filterCategory === 'CAMBIOS') return cat === 'CAMBIO_DIVISA';
                if (filterCategory === 'VENTAS') return ['VENTA', 'COBRO_DEUDA', 'INYECCION_CAPITAL'].includes(cat);
                return true;
            });
        }
        return result;
    }, [transactions, filterCategory, dateFilterType, selectedDate]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

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



            {/* Summary Cards */}
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Ingresos"
                    value={formatCurrency(filteredTransactions.reduce((acc: number, tx: any) => acc + (tx.transaction_type === 'ENTRADA' ? (tx.amount_usd || 0) : 0), 0), 'USD')}
                    subtext="Ingresos filtrados"
                    icon={<Icons.ArrowUpRight />}
                    color="green"
                />
                <StatCard
                    title="Total Egresos"
                    value={formatCurrency(filteredTransactions.reduce((acc: number, tx: any) => acc + (tx.transaction_type === 'SALIDA' ? (tx.amount_usd || 0) : 0), 0), 'USD')}
                    subtext="Egresos filtrados"
                    icon={<Icons.ArrowDownRight />}
                    color="red"
                />
                <StatCard
                    title="Balance Neto"
                    value={formatCurrency(filteredTransactions.reduce((acc: number, tx: any) => acc + (tx.transaction_type === 'ENTRADA' ? (tx.amount_usd || 0) : -(tx.amount_usd || 0)), 0), 'USD')}
                    subtext="Balance de movimientos"
                    icon={<Icons.Wallet />}
                    color="blue"
                />
            </div>

            {/* Transactions Table */}
            <Card className="p-6">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Movimientos Recientes</h3>

                        {/* Type Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {['ALL', 'VENTAS', 'GASTOS', 'NOMINA', 'CAMBIOS'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}
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

                    {/* Date Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                        <div className="flex gap-2">
                            {['ALL_TIME', 'DAY', 'WEEK', 'MONTH', 'YEAR'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => { setDateFilterType(type as any); setCurrentPage(1); }}
                                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${dateFilterType === type
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {type === 'ALL_TIME' && 'Todo'}
                                    {type === 'DAY' && 'Día'}
                                    {type === 'WEEK' && 'Semana'}
                                    {type === 'MONTH' && 'Mes'}
                                    {type === 'YEAR' && 'Año'}
                                </button>
                            ))}
                        </div>

                        {dateFilterType !== 'ALL_TIME' && (
                            <div className="flex items-center gap-2">
                                <Input
                                    type={dateFilterType === 'MONTH' ? 'month' : dateFilterType === 'YEAR' ? 'number' : dateFilterType === 'WEEK' ? 'week' : 'date'}
                                    value={
                                        dateFilterType === 'YEAR' ? selectedDate.getFullYear().toString() :
                                            dateFilterType === 'MONTH' ? selectedDate.toISOString().slice(0, 7) :
                                                dateFilterType === 'WEEK' ? (() => {
                                                    // Format: YYYY-Www
                                                    const d = new Date(selectedDate);
                                                    d.setHours(0, 0, 0, 0);
                                                    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
                                                    const week1 = new Date(d.getFullYear(), 0, 4);
                                                    const week = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
                                                    return `${d.getFullYear()}-W${week.toString().padStart(2, '0')}`;
                                                })() :
                                                    selectedDate.toISOString().slice(0, 10)
                                    }
                                    onChange={(e) => {
                                        if (!e.target.value) return;
                                        const val = e.target.value;
                                        setCurrentPage(1);
                                        if (dateFilterType === 'YEAR') {
                                            const year = parseInt(val);
                                            const newDate = new Date(selectedDate);
                                            newDate.setFullYear(year);
                                            setSelectedDate(newDate);
                                        } else if (dateFilterType === 'WEEK') {
                                            // Handle YYYY-Www, rough approx sufficient for setting state, actual filtering uses library or simple math usually
                                            // For now, simple parsing if needed or rely on Input behavior
                                            const [y, w] = val.split('-W');
                                            // Calculate date from week... simplistic approach:
                                            const simple = new Date(parseInt(y), 0, 1 + (parseInt(w) - 1) * 7);
                                            setSelectedDate(simple);
                                        } else {
                                            // Month (YYYY-MM) or Date (YYYY-MM-DD) work with new Date()
                                            // Need to append day for month type to be safe? new Date('2024-02') works as Feb 1
                                            // But for local time issues, better to handle carefully. 
                                            // For simplicity in this iteration:
                                            setSelectedDate(new Date(val));
                                        }
                                    }}
                                    className="w-auto h-8 text-sm"
                                />
                                {dateFilterType === 'WEEK' && <span className="text-xs text-slate-400">(Inicio aprox)</span>}
                            </div>
                        )}
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
                            ) : (paginatedTransactions || []).map((tx: any) => (
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
                            {!loadingTransactions && (!paginatedTransactions || paginatedTransactions.length === 0) && (
                                <tr><td colSpan={6} className="text-center py-8">No hay movimientos registrados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {!loadingTransactions && filteredTransactions.length > 0 && (
                    <div className="flex justify-between items-center py-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-500">
                            Mostrando {Math.min((currentPage - 1) * 10 + 1, filteredTransactions.length)} - {Math.min(currentPage * 10, filteredTransactions.length)} de {filteredTransactions.length}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            >
                                <Icons.ChevronLeft size={16} /> Anterior
                            </Button>
                            <span className="flex items-center text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 rounded text-slate-600 dark:text-slate-300">
                                {currentPage}
                            </span>
                            <Button
                                variant="ghost"
                                disabled={currentPage * 10 >= filteredTransactions.length}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                Siguiente <Icons.ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
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
