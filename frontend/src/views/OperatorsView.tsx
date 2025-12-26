import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Icons } from '../components/atoms/Icons';

interface OperatorsViewProps {
    isDemoMode: boolean;
    operators: any[];
    demoOperators: any[]; // Using the constant array from App
}

export const OperatorsView: React.FC<OperatorsViewProps> = ({ isDemoMode, operators, demoOperators }) => {
    // Logic to unify data source
    const displayOperators = (isDemoMode ? demoOperators.map(op => ({
        ...op,
        location: 'Caracas, VE',
        last: 'Active Now',
        active: true,
        profit: (Math.random() * 500 + 100).toFixed(2),
        volume: (Math.random() * 5000 + 1000).toFixed(2)
    })) : (operators || []));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Panel de Operadores (Camellos)</h2>
                    <p className="text-sm text-slate-500">Gestión de rendimientos y habilitación de cuentas.</p>
                </div>
                <Button variant="secondary" icon={<Icons.Plus />}>Gestionar / Agregar Camellos</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayOperators.map((camello: any) => (
                    <Card key={camello.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${camello.color || 'bg-slate-900 text-white'}`}>
                                    {camello.avatar || camello.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{camello.name}</h3>
                                    <p className="text-xs text-slate-500">{camello.location}</p>
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                                Última actividad <br /> {camello.last}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className={`p-3 rounded-lg ${camello.active ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                    {camello.active && <span className="text-green-500">↗</span>} Ganancia
                                </p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">${camello.profit}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><span className="text-blue-500">Activity</span> Volumen</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">${camello.volume}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
                            <span>ID: {camello.id}</span>
                            <button className="text-brand-600 hover:underline">Ver Detalles / Gestionar</button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
