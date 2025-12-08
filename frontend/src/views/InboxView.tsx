import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';

import { Message } from '../types';

interface InboxViewProps {
    isDemoMode: boolean;
    demoMessages: Message[];
}

export const InboxView: React.FC<InboxViewProps> = ({ isDemoMode, demoMessages }) => {
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

    // Filter messages based on demo mode
    const displayMessages = isDemoMode ? demoMessages : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Icons.Inbox /> Centro de Mensajes
                    </h2>
                    <p className="text-sm text-slate-500">Comunicación directa entre Admin y Operadores.</p>
                </div>
                <Button variant="primary" icon={<Icons.Plus />}>Nuevo Mensaje</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {/* Message List */}
                <Card className="col-span-1 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-white dark:bg-slate-900">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                            <Icons.Search />
                            <input type="text" placeholder="Buscar mensajes..." className="w-full pl-8 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                            <div className="absolute left-2 top-2.5 text-slate-400 pointer-events-none"><span className="w-4 h-4 ml-1"></span></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {displayMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMessageId(msg.id)}
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${selectedMessageId === msg.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-brand-500' : (msg.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : '')}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{msg.avatar}</span>
                                        <span className={`font-bold text-sm ${msg.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{msg.sender}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                                </div>
                                <p className={`text-xs ${msg.unread ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500'} line-clamp-2`}>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="col-span-1 md:col-span-2 flex flex-col h-full bg-slate-50 dark:bg-slate-950/50">
                    {selectedMessageId ? (
                        <div className="flex flex-col h-full">
                            {/* Chat Header */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{displayMessages.find(m => m.id === selectedMessageId)?.avatar}</span>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{displayMessages.find(m => m.id === selectedMessageId)?.sender}</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> En línea</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><Icons.Support /></button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className="flex justify-center"><span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Hoy</span></div>

                                {/* Received Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">{displayMessages.find(m => m.id === selectedMessageId)?.avatar}</div>
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{displayMessages.find(m => m.id === selectedMessageId)?.text}</p>
                                        <span className="text-[10px] text-slate-400 mt-1 block text-right">{displayMessages.find(m => m.id === selectedMessageId)?.time}</span>
                                    </div>
                                </div>

                                {/* Sent Message (Mock) */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">TG</div>
                                    <div className="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                                        <p className="text-sm">Recibido, procedemos con la validación.</p>
                                        <span className="text-[10px] text-brand-200 mt-1 block text-right">Justo ahora</span>
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-slate-600"><Icons.Camera /></button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600"><Icons.Upload /></button>
                                    <input type="text" placeholder="Escribe un mensaje..." className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                                    <button className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"><Icons.Send /></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="w-16 h-16 mb-4 opacity-50"><Icons.Inbox /></div>
                            <p>Selecciona un mensaje para leer.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
