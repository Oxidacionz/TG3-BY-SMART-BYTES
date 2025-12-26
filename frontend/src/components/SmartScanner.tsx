import React, { useState, useRef } from 'react';

// Icons
const Icons = {
    Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>,
    Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>,
    Spinner: () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
};

interface SmartScannerProps {
    onScanComplete: (data: any) => void;
    onViewFull?: (url: string) => void;
    onClear?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const SmartScanner: React.FC<SmartScannerProps> = ({ onScanComplete, onViewFull, onClear }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validaciones Cliente
        if (file.size > MAX_FILE_SIZE) {
            setError('El archivo es demasiado grande (Máx 5MB)');
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onload = (event) => setPreview(event.target?.result as string);
        reader.readAsDataURL(file);

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Fetch al endpoint
            // Nota: Vite proxy maneja el target http://localhost:8001
            const response = await fetch('/api/v1/scanner/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `Error del servidor (${response.status})`);
            }

            const data = await response.json();

            // Éxito
            console.log('✅ Scanner Result:', data);

            // Mapeo simple por si el backend devuelve estructura diferente a la esperada por el form
            // Backend devuelve Transaction (amount, platform, currency...)
            // onScanComplete espera probablemente el mismo shape
            onScanComplete(data);

        } catch (err: any) {
            console.error('❌ Scanner Error:', err);
            setError(err.message || 'Error al procesar la imagen.');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    const handleClear = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onClear) onClear(); // Llama a la funcion del padre para limpiar el formulario
    };

    return (
        <div className="w-full bg-slate-900 rounded-xl p-6 text-center text-white flex flex-col items-center justify-center relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent"></div>
            <div className="relative z-10 w-full">
                {/* Preview Area */}
                <button
                    onClick={() => preview && onViewFull && onViewFull(preview)}
                    disabled={!preview || loading}
                    className={`w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 transition-all ${preview ? 'border-brand-500/50 cursor-zoom-in hover:scale-105 hover:border-brand-500' : 'border-slate-700 cursor-default'
                        } shadow-xl relative group overflow-hidden`}
                >
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute inset-0 bg-brand-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                            </div>
                        </>
                    ) : loading ? (
                        <Icons.Spinner />
                    ) : (
                        <Icons.Camera />
                    )}
                </button>

                <h4 className="font-bold text-lg mb-2">Escanear Comprobante</h4>
                <p className="text-xs text-slate-400 mb-6">
                    {loading ? "Analizando imagen con IA..." : "Sube una captura de pago móvil o transferencia."}
                </p>

                {error && <p className="text-red-400 text-xs mb-4 bg-red-900/30 p-2 rounded border border-red-800">{error}</p>}

                <div className="space-y-3 w-full">
                    {/* Botón Upload Real */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-900/20"
                        disabled={loading}
                    >
                        <Icons.Upload /> {loading ? 'Procesando...' : 'Subir Imagen'}
                    </button>

                    {/* Botón Clear */}
                    {preview && !loading && (
                        <button
                            onClick={handleClear}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-bold text-xs border border-slate-700 transition-colors"
                        >
                            Limpiar / Reiniciar
                        </button>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                    />
                </div>
            </div>
        </div>
    );
};
