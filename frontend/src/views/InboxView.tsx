import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Icons } from '../components/atoms/Icons';
import { chatService, InboxItem, ChatMessage } from '../services/chatService';

interface InboxViewProps {
    isDemoMode: boolean;
    demoMessages: any[]; // Kept for prop compatibility but unused
}

export const InboxView: React.FC<InboxViewProps> = ({ isDemoMode }) => {
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Polling setup
    // Polling setup
    useEffect(() => {
        const fetchInbox = async () => {
            try {
                setLoading(true);
                console.log("Fetching inbox...");
                const data = await chatService.getInbox();
                console.log("Inbox data received:", data);
                if (Array.isArray(data)) {
                    setInboxItems(data);
                } else {
                    console.error("Inbox data is not an array:", data);
                }
            } catch (e) {
                console.error("Error fetching inbox", e);
            } finally {
                setLoading(false);
            }
        };

        fetchInbox();
        // const interval = setInterval(fetchInbox, 10000); // Disable poll while debugging
        // return () => clearInterval(interval);
    }, []);

    // Conversation fetching
    useEffect(() => {
        if (!selectedContactId) return;

        const fetchConversation = async () => {
            try {
                const data = await chatService.getConversation(selectedContactId);
                setMessages(data);
                // Also refresh inbox to clear unread badge
                const inboxData = await chatService.getInbox();
                setInboxItems(inboxData);
            } catch (e) {
                console.error("Error fetching conversation", e);
            }
        };

        fetchConversation();
        // Poll for new messages in active chat more frequently
        const interval = setInterval(fetchConversation, 3000);
        return () => clearInterval(interval);
    }, [selectedContactId]);

    // Scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedContactId) return;

        try {
            await chatService.sendMessage(selectedContactId, newMessage);
            setNewMessage('');
            // Optimistic update or wait for poll? Let's just quick fetch
            const msgs = await chatService.getConversation(selectedContactId);
            setMessages(msgs);

            // Move contact to top of inbox
            const inbox = await chatService.getInbox();
            setInboxItems(inbox);
        } catch (e) {
            console.error("Error sending", e);
        }
    };

    const activeContact = inboxItems.find(i => i.contact_id === selectedContactId);

    const formatTime = (isoString: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Icons.Inbox /> Centro de Mensajes (Chat Interno)
                    </h2>
                    <p className="text-sm text-slate-500">Comunicación con Operadores y Clientes.</p>
                </div>
                <Button variant="primary" icon={<Icons.Plus />}>Nuevo Chat</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {/* Inbox List */}
                <Card className="col-span-1 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-white dark:bg-slate-900">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                            <Icons.Search />
                            <input type="text" placeholder="Buscar..." className="w-full pl-8 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {inboxItems.length === 0 && (
                            <div className="p-4 text-center text-slate-400 text-sm">No hay chats recientes</div>
                        )}
                        {inboxItems.map((item) => (
                            <div
                                key={item.contact_id}
                                onClick={() => setSelectedContactId(item.contact_id)}
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${selectedContactId === item.contact_id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-brand-500' : (item.unread_count > 0 ? 'bg-blue-50/30 dark:bg-blue-900/10' : '')}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{item.avatar}</span>
                                        <span className={`font-bold text-sm ${item.unread_count > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{item.contact_name}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{formatTime(item.last_message_time)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs ${item.unread_count > 0 ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500'} line-clamp-1 flex-1`}>
                                        {item.last_message}
                                    </p>
                                    {item.unread_count > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {item.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="col-span-1 md:col-span-2 flex flex-col h-full bg-slate-50 dark:bg-slate-950/50">
                    {selectedContactId && activeContact ? (
                        <div className="flex flex-col h-full">
                            {/* Chat Header */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{activeContact.avatar}</span>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{activeContact.contact_name}</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${activeContact.status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            {activeContact.status === 'online' ? 'En línea' : 'Desconectado'}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><Icons.Support /></button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.sender_id === 'ADMIN';
                                    return (
                                        <div key={idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isMe ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                {msg.sender_avatar || (msg.sender_name ? msg.sender_name[0] : '?')}
                                            </div>
                                            <div className={`${isMe ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 rounded-tl-none'} p-3 rounded-2xl shadow-sm max-w-[80%]`}>
                                                <p className={`text-sm ${isMe ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>{msg.content}</p>
                                                <span className={`text-[10px] mt-1 block text-right ${isMe ? 'text-brand-200' : 'text-slate-400'}`}>
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                    className="flex gap-2"
                                >
                                    <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Icons.Camera /></button>
                                    <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Icons.Upload /></button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
                                        <Icons.Send />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="w-16 h-16 mb-4 opacity-50"><Icons.Inbox /></div>
                            <p>Selecciona un chat para comenzar.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
