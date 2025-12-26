import React from 'react';
import { Badge } from '../atoms/Badge';

/**
 * TransactionCard Component (Molecule)
 * Card for displaying transaction information
 */

export interface TransactionCardProps {
    fecha: string;
    monto: number;
    moneda: string;
    referencia: string;
    bancoEmisor: string;
    bancoReceptor: string;
    status: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO' | 'REVISION';
    tipoTransaccion: 'ENTRADA' | 'SALIDA';
    imageUrl?: string;
    onViewReceipt?: () => void;
    className?: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
    fecha,
    monto,
    moneda,
    referencia,
    bancoEmisor,
    bancoReceptor,
    status,
    tipoTransaccion,
    imageUrl,
    onViewReceipt,
    className = ''
}) => {
    const statusVariants = {
        COMPLETADO: 'success' as const,
        PENDIENTE: 'warning' as const,
        FALLIDO: 'error' as const,
        REVISION: 'info' as const
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: currency === 'VES' ? 'VES' : 'USD'
        }).format(amount);
    };

    return (
        <div className={`bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-blue-500/30 transition-all ${className}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-2xl font-black ${tipoTransaccion === 'ENTRADA' ? 'text-green-400' : 'text-red-400'}`}>
                            {tipoTransaccion === 'ENTRADA' ? '+' : '-'} {formatCurrency(monto, moneda)}
                        </span>
                        <Badge variant={statusVariants[status]} size="sm">
                            {status}
                        </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{new Date(fecha).toLocaleDateString('es-VE')}</p>
                </div>
                {imageUrl && onViewReceipt && (
                    <button
                        onClick={onViewReceipt}
                        className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                    >
                        Ver comprobante
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-slate-500 text-xs">Referencia</p>
                    <p className="text-white font-mono">{referencia}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs">De → A</p>
                    <p className="text-white text-xs">{bancoEmisor} → {bancoReceptor}</p>
                </div>
            </div>
        </div>
    );
};
