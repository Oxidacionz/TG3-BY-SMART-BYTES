import React, { useState, useRef } from 'react';

const Icons = {
    Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>,
    Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>,
    Spinner: () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
};

interface SmartScannerProps {
    onScanComplete: (data: any) => void;
}

export const SmartScanner: React.FC<SmartScannerProps> = ({ onScanComplete }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Adjust URL to point to backend. 
            // In dev: http://localhost:8000/api/v1/scanner/
            const response = await fetch('http://localhost:8000/api/v1/scanner/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
                throw new Error(err.detail || 'Error scanning image');
            }

            const result = await response.json();
            if (result.status === 'success') {
                onScanComplete(result.data);
            } else {
                setError('Failed to process image');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-slate-900 rounded-xl p-6 text-center text-white flex flex-col items-center justify-center relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent"></div>
            <div className="relative z-10 w-full">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    {loading ? <Icons.Spinner /> : <Icons.Camera />}
                </div>
                <h4 className="font-bold text-lg mb-2">Escanear Comprobante</h4>
                <p className="text-xs text-slate-400 mb-6">Toma una foto al comprobante físico o digital.</p>

                {error && <p className="text-red-400 text-xs mb-2 bg-red-900/50 p-1 rounded">{error}</p>}

                <div className="space-y-3 w-full">
                    <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors" disabled={loading}>
                        <Icons.Camera /> Usar Cámara
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        disabled={loading}
                    >
                        <Icons.Upload /> {loading ? 'Procesando...' : 'Subir Archivo'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,application/pdf"
                    />
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 w-full">
                    <p className="text-xs text-slate-500 mb-2">Modo de Análisis</p>
                    <div className="flex gap-2 justify-center">
                        <span className="bg-brand-900 text-brand-300 px-2 py-1 rounded text-xs border border-brand-700">Bancario</span>
                        <span className="text-slate-500 px-2 py-1 text-xs">Chats (WS/TG)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
