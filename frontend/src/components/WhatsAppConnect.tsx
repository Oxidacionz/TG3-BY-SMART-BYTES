import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';

// Ajusta esto si tu backend está en otro puerto
const API_BASE = 'http://localhost:8001/api/v1/webhook/whatsapp';

export const WhatsAppConnect = () => {
    const [status, setStatus] = useState<string>('LOADING');
    const [qrUrl, setQrUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Initial check
    const checkStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/status`);
            const data = await res.json();

            if (data.status === 'AUTHENTICATED') {
                setStatus('AUTHENTICATED');
            } else if (data.status === 'SCAN_QR_CODE') {
                setStatus('SCAN_QR_CODE');
                // Force refresh image prevent cache
                setQrUrl(`${API_BASE}/qr?t=${Date.now()}`);
            } else {
                setStatus('DISCONNECTED');
            }
        } catch (e) {
            console.error('Connection failed:', e);
            setStatus('ERROR');
        }
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const handleConnect = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE}/connect`, { method: 'POST' });
            // Wait a bit for WAHA to generate QR
            setTimeout(checkStatus, 3000);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    WhatsApp Bot
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'AUTHENTICATED' ? 'bg-green-100 text-green-700' :
                    status === 'SCAN_QR_CODE' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {status === 'AUTHENTICATED' ? 'CONECTADO' :
                        status === 'SCAN_QR_CODE' ? 'ESPERANDO ESCANEO' :
                            status === 'LOADING' ? 'CARGANDO...' : 'DESCONECTADO'}
                </span>
            </div>

            {status === 'DISCONNECTED' || status === 'STOPPED' || status === 'ERROR' ? (
                <div className="text-center py-6">
                    <p className="text-slate-500 mb-4">El bot está desconectado.</p>
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 mx-auto"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                        Iniciar Conexión
                    </button>
                </div>
            ) : status === 'SCAN_QR_CODE' ? (
                <div className="flex flex-col items-center">
                    <p className="text-sm text-slate-500 mb-2 font-medium">Escanea con tu WhatsApp</p>
                    <div className="bg-white p-2 rounded-lg shadow-inner border border-slate-200">
                        {qrUrl ? (
                            <img src={qrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                        ) : (
                            <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                                <Loader2 className="animate-spin w-8 h-8" />
                            </div>
                        )}
                    </div>
                </div>
            ) : status === 'AUTHENTICATED' ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="font-medium text-slate-700 dark:text-gray-200">¡Sesión Activa!</p>
                            <p className="text-xs text-slate-500">Bot operativo.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 text-slate-400">
                    <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    <p className="text-xs mt-2">Verificando estado...</p>
                </div>
            )}
        </div>
    );
};
