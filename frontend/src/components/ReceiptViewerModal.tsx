import React from 'react';

interface ReceiptViewerModalProps {
    imageUrl: string;
    onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 max-w-4xl w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-red-500 transition-colors z-10 shadow-lg"
                    aria-label="Cerrar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="p-4 overflow-auto max-h-[85vh] flex justify-center bg-slate-950">
                    <img
                        src={imageUrl}
                        alt="Comprobante"
                        className="max-w-full h-auto rounded-xl shadow-2xl"
                    />
                </div>

                <div className="p-4 text-center bg-slate-900 border-t border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Comprobante Original ToroGroup
                    </p>
                </div>
            </div>
        </div>
    );
};
