import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Icons } from '../components/atoms/Icons';

export const ExpensesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Control de Gastos</h2>
                    <p className="text-sm text-slate-500">Gestión de gastos operativos y consumos de logística.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" icon={<Icons.Printer />}>Imprimir Reporte</Button>
                    <Button variant="secondary" icon={<Icons.Plus />}>Registrar Gasto</Button>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-medium flex items-center gap-2"><Icons.Expenses /> Gastos Operativos</button>
                <button className="px-4 py-2 bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Consumos / Logística</button>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Total Operativo</h3>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">0 <span className="text-lg font-normal text-slate-400">USD (Est.)</span></h2>
                <p className="text-xs text-slate-500">Acumulado del mes actual</p>
            </Card>

            <Card className="min-h-[200px] flex items-center justify-center text-slate-400">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">FECHA</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">DESCRIPCIÓN</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">MONTO</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-400">No hay registros en esta categoría.</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
