import React from 'react';
import { TransactionCard } from '../molecules/TransactionCard';
import { Comprobante } from '../../types';

/**
 * TransactionList Organism
 * Displays a list of transactions using TransactionCard molecules
 */

export interface TransactionListProps {
    transactions: Comprobante[];
    onViewReceipt?: (imageUrl: string) => void;
    emptyMessage?: string;
    className?: string;
}

export const TransactionListOrganism: React.FC<TransactionListProps> = ({
    transactions,
    onViewReceipt,
    emptyMessage = 'No hay transacciones registradas',
    className = ''
}) => {
    if (transactions.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-500 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {transactions.map((transaction) => (
                <TransactionCard
                    key={transaction.id}
                    fecha={transaction.fecha}
                    monto={transaction.monto}
                    moneda={transaction.moneda}
                    referencia={transaction.referencia}
                    bancoEmisor={transaction.bancoEmisor}
                    bancoReceptor={transaction.bancoReceptor}
                    status={transaction.status}
                    tipoTransaccion={transaction.tipoTransaccion}
                    imageUrl={transaction.imageUrl}
                    onViewReceipt={transaction.imageUrl && onViewReceipt ? () => onViewReceipt(transaction.imageUrl!) : undefined}
                />
            ))}
        </div>
    );
};
