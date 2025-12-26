import React, { useState } from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Icons } from '../components/atoms/Icons';
import { Input } from '../components/atoms/Input';

interface ClientsViewProps {
    isDemoMode: boolean;
    clients: any[];
    demoClients: string[]; // Passing names array as per original logic
}

export const ClientsView: React.FC<ClientsViewProps> = ({ isDemoMode, clients, demoClients }) => {
    const [selectedClient, setSelectedClient] = useState<any | null>(null);

    // Replicating the logic from App.tsx: mapping plain strings to objects if demo
    const displayClients = ((isDemoMode ? demoClients.map((name, i) => ({
        name,
        last: `${Math.floor(Math.random() * 24)}h ago`,
        id: `CLI-${i}`,
        volume: (Math.random() * 10000).toFixed(2),
        deals: Math.floor(Math.random() * 50)
    })) : (clients || [])));

    return (
        <div className="h-full flex gap-6">
            <Card className="w-1/3 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white">Directorio de Clientes y Proveedores</h3>
                    <button className="bg-brand-600 text-white rounded p-1 hover:bg-brand-700"><Icons.Plus /></button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
                        <Input placeholder="Buscar cliente o proveedor..." className="pl-10" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {displayClients.map((client: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedClient(client)}
                            className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors ${selectedClient?.id === client.id ? 'bg-blue-50 dark:bg-blue-900/20 shadow-inner' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                                {client.name ? client.name.substring(0, 2).toUpperCase() : '??'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{client.name}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><Icons.Clock /> Última: {client.last}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                {selectedClient ? (
                    // Placeholder for detail view
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xl font-bold">
                            {selectedClient.name.substring(0, 2).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedClient.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">ID: {selectedClient.id}</p>
                        <div className="flex gap-4 justify-center">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Volumen</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200">${selectedClient.volume}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Transacciones</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200">{selectedClient.deals}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600">
                            <Icons.Users />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Selecciona un cliente/proveedor</h3>
                        <p className="text-sm">Haz clic en un cliente/proveedor o agrega uno nuevo para ver detalles.</p>
                    </>
                )}
            </div>
        </div>
    );
};
