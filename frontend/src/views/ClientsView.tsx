import React, { useState } from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Icons } from '../components/atoms/Icons';
import { Input } from '../components/atoms/Input';
import { ClientLedger } from '../components/organisms/ClientLedger';

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
        <div className="h-full flex flex-col md:flex-row gap-6 relative">
            {/* List Sidebar - Hidden on mobile if client selected */}
            <Card className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${selectedClient ? 'hidden md:flex md:w-1/3' : 'w-full md:w-1/3'}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white">Directorio</h3>
                    <button className="bg-brand-600 text-white rounded p-1 hover:bg-brand-700"><Icons.Plus /></button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
                        <Input placeholder="Buscar..." className="pl-10" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {displayClients.map((client: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedClient(client)}
                            className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors ${selectedClient?.id === client.id ? 'bg-blue-50 dark:bg-blue-900/20 shadow-inner border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                                {client.name ? client.name.substring(0, 2).toUpperCase() : '??'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{client.name}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><Icons.Clock /> {client.last}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Detail View - Full width on mobile when selected */}
            <div className={`flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 transition-all duration-300 ${selectedClient ? 'flex' : 'hidden md:flex'} ${selectedClient ? 'w-full md:w-2/3' : ''}`}>
                {selectedClient ? (
                    <div className="w-full h-full p-0 md:p-6 relative">
                        {/* Mobile Back Button */}
                        <div className="md:hidden p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2 sticky top-0 z-10">
                            <Button variant="ghost" onClick={() => setSelectedClient(null)}>
                                <Icons.ChevronLeft /> Volver
                            </Button>
                            <span className="font-bold text-slate-800 dark:text-white truncate">{selectedClient.name}</span>
                        </div>
                        <div className="h-full overflow-y-auto p-4 md:p-0">
                            <ClientLedger client={selectedClient} isDemoMode={isDemoMode} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600 flex items-center justify-center">
                            <Icons.Users />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Selecciona un cliente</h3>
                        <p className="text-sm max-w-xs mx-auto">Haz clic en un cliente o proveedor para ver su información detallada.</p>
                    </div>
                )}
            </div>
        </div>
    );
    );
};
