import React from 'react';
import { StatCard } from '../molecules/StatCard';
import { Comprobante } from '../../types';

/**
 * DashboardStats Organism
 * Displays key statistics using StatCard molecules
 */

export interface DashboardStatsProps {
    transactions: Comprobante[];
    className?: string;
}

export const DashboardStatsOrganism: React.FC<DashboardStatsProps> = ({
    transactions,
    className = ''
}) => {
    // Calculate statistics
    const totalTransactions = transactions.length;
    const totalEntradas = transactions.filter(t => t.tipoTransaccion === 'ENTRADA').reduce((sum, t) => sum + t.monto, 0);
    const totalSalidas = transactions.filter(t => t.tipoTransaccion === 'SALIDA').reduce((sum, t) => sum + t.monto, 0);
    const balance = totalEntradas - totalSalidas;
    const completedCount = transactions.filter(t => t.status === 'COMPLETADO').length;
    const successRate = totalTransactions > 0 ? (completedCount / totalTransactions) * 100 : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${className}`}>
            <StatCard
                title="Balance Total"
                value={formatCurrency(balance)}
                subtitle="Entradas - Salidas"
                trend={balance > 0 ? { value: 12.5, isPositive: true } : undefined}
                tooltipText="Representa el saldo neto de todas tus operaciones. Se calcula restando el total de salidas del total de entradas para mostrar tu posición financiera actual."
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />

            <StatCard
                title="Entradas"
                value={formatCurrency(totalEntradas)}
                subtitle={`${transactions.filter(t => t.tipoTransaccion === 'ENTRADA').length} transacciones`}
                tooltipText="Suma total de todas las transacciones de entrada registradas en el sistema. Incluye transferencias recibidas, pagos móviles y otros ingresos."
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                }
            />

            <StatCard
                title="Salidas"
                value={formatCurrency(totalSalidas)}
                subtitle={`${transactions.filter(t => t.tipoTransaccion === 'SALIDA').length} transacciones`}
                tooltipText="Suma total de todas las transacciones de salida. Incluye pagos realizados, transferencias enviadas y comisiones del sistema."
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                }
            />

            <StatCard
                title="Tasa de Éxito"
                value={`${successRate.toFixed(1)}%`}
                subtitle={`${completedCount} de ${totalTransactions} completadas`}
                trend={{ value: successRate, isPositive: successRate > 90 }}
                tooltipText="Representa la precisión media de procesamiento. El sistema llega automáticamente hasta alcanzar el 95%+ antes de auto-registrar las transacciones."
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
        </div>
    );
};
