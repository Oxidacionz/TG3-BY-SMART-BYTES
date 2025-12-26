import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../atoms/Icons';
import { Card } from '../atoms/Card';
import { advisorService } from '../../services/advisorService';

interface Message {
    id: string;
    sender: 'user' | 'advisor';
    text: string;
    timestamp: Date;
}

interface AdvisorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'advisor', text: '¡Hola! Soy el Profesor Toro. 🐂🎓 Estoy aquí para ayudarte a entender tus finanzas. ¿En qué puedo orientarte hoy?', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const data = await advisorService.sendMessage(userMsg.text);
            const advisorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'advisor', text: data.response, timestamp: new Date() };
            setMessages(prev => [...prev, advisorMsg]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'advisor', text: 'Lo siento, tuve problemas para conectar con mi cerebro financiero. Intenta de nuevo.', timestamp: new Date() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                // Send audio logic
                setIsLoading(true);
                try {
                    // Optimistic UI for Audio... maybe show "Procesando audio..."
                    const loadingMsg: Message = { id: 'temp-audio', sender: 'user', text: '🎤 [Audio Enviado...]', timestamp: new Date() };
                    setMessages(prev => [...prev, loadingMsg]);

                    const data = await advisorService.sendAudio(audioBlob);

                    // Replace temp message or just add new ones
                    setMessages(prev => prev.filter(m => m.id !== 'temp-audio'));

                    const userTranscript: Message = { id: Date.now().toString(), sender: 'user', text: `🎤 "${data.transcript}"`, timestamp: new Date() };
                    const advisorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'advisor', text: data.response, timestamp: new Date() };

                    setMessages(prev => [...prev, userTranscript, advisorMsg]);

                } catch (error) {
                    console.error('Error sending audio:', error);
                    setMessages(prev => prev.filter(m => m.id !== 'temp-audio'));
                } finally {
                    setIsLoading(false);
                    stream.getTracks().forEach(track => track.stop()); // Stop mic
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('No se pudo acceder al micrófono.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="w-full max-w-md h-[600px] flex flex-col relative !bg-slate-900 !border-slate-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 p-1 overflow-hidden border border-indigo-500/30">
                            <img src="/TG3-BY-SMART-BYTES/assets/ai-advisor.png" alt="Advisor" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Profesor Toro AI</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                En línea
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <Icons.Close />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                <div className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-800 rounded-2xl p-3 rounded-bl-none border border-slate-700 flex gap-1 items-center">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Pregunta sobre tu cuenta..."
                            className="flex-1 bg-slate-800 text-white border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder-slate-500"
                            disabled={isLoading || isRecording}
                        />

                        {inputText.trim() ? (
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                            >
                                <Icons.Send />
                            </button>
                        ) : (
                            <button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onMouseLeave={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                title="Mantener presionado para hablar"
                            >
                                <Icons.Microphone />
                            </button>
                        )}
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-600">
                            {isRecording ? "Grabando... Suelta para enviar" : "Profesor Toro solo ve información de tu cuenta."}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
