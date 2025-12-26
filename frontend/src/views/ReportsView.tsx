import React from 'react';
import { Card } from '../components/atoms/Card';
import { Icons } from '../components/atoms/Icons';

export const ReportsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Icons.Reports /> Reportes & Datos</h2>
                <p className="text-sm text-slate-500">Exporta historial o importa datos desde documentos externos.</p>
            </div>

            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                <button className="px-4 py-2 text-sm font-medium border-b-2 border-brand-600 text-brand-600">Generar Reportes</button>
                <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Importar Datos</button>
            </div>

            <Card className="p-8">
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Exportar Transacciones</h3>
                <p className="text-sm text-slate-500 mb-6">Descarga el historial completo de transacciones para auditoría externa o imprímelo directamente.</p>

                <div className="flex gap-4">
                    <button className="flex-1 p-4 border border-green-100 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center gap-3 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">
                        <Icons.Download />
                        <div className="text-left">
                            <div className="font-bold">Descargar Excel (CSV)</div>
                            <div className="text-xs opacity-70">Formato compatible universal</div>
                        </div>
                    </button>
                    <button className="flex-1 p-4 border border-red-100 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center justify-center gap-3 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                        <Icons.Printer />
                        <div className="text-left">
                            <div className="font-bold">Imprimir / PDF</div>
                            <div className="text-xs opacity-70">Vista de impresión del navegador</div>
                        </div>
                    </button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-300 flex gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>Nota: El reporte incluye todas las transacciones visibles actualmente. Para filtrar por fechas específicas, utilice los filtros en la pestaña "Transacciones" antes de exportar, o filtre el archivo Excel descargado.</p>
                </div>
            </Card>
        </div>
    );
};
