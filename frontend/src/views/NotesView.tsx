import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Icons } from '../components/atoms/Icons';

export const NotesView: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Notas & Recordatorios</h2>
                    <p className="text-sm text-slate-500">Apuntes rápidos y tareas pendientes.</p>
                </div>
                <Button variant="secondary" icon={<Icons.Plus />}>Nueva Nota</Button>
            </div>
            <div className="h-96 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <div className="w-12 h-12 mb-2 opacity-50"><Icons.Notes /></div>
                <p>No tienes notas guardadas.</p>
            </div>
        </div>
    );
};
