import React, { useState } from 'react';
import { Modal } from '../molecules/Modal';
import { SmartScanner } from '../SmartScanner';
import { ReceiptViewerModal } from '../ReceiptViewerModal';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Icons } from '../atoms/Icons';

interface DashboardModalsProps {
    isTransactionModalOpen: boolean;
    setTransactionModalOpen: (open: boolean) => void;
    isSupportModalOpen: boolean;
    setSupportModalOpen: (open: boolean) => void;
    isDemoMode: boolean;
    handleScanComplete: (data: any) => void;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmitTransaction: () => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
    isTransactionModalOpen,
    setTransactionModalOpen,
    isSupportModalOpen,
    setSupportModalOpen,
    isDemoMode,
    handleScanComplete,
    formData,
    handleInputChange,
    onSubmitTransaction
}) => {
    const [viewerUrl, setViewerUrl] = useState<string | null>(null);

    return (
        <>
            {/* Transaction Modal */}
            <Modal isOpen={isTransactionModalOpen} onClose={() => setTransactionModalOpen(false)} title="Registrar Transacción" size="xl">
                <div className="flex flex-col md:flex-row gap-4 h-full">
                    <div className="w-full md:w-1/3 flex flex-col justify-between">
                        <SmartScanner
                            onScanComplete={handleScanComplete}
                            onViewFull={(url) => setViewerUrl(url)}
                        />
                        {isDemoMode && (
                            <div className="mt-2 text-center">
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">Modo Demo</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                        {/* Transaction Type Buttons - Ultra Compact */}
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => handleInputChange({ target: { name: 'type', value: 'ENTRADA' } } as any)}
                                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${formData.type === 'ENTRADA' ? 'bg-green-600 text-white shadow shadow-green-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
                            >
                                <Icons.Download />
                                <span>ENTRADA</span>
                            </button>
                            <button
                                onClick={() => handleInputChange({ target: { name: 'type', value: 'SALIDA' } } as any)}
                                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${formData.type === 'SALIDA' ? 'bg-red-600 text-white shadow shadow-red-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
                            >
                                <Icons.Upload />
                                <span>SALIDA</span>
                            </button>
                        </div>

                        {/* Row 1: Client (65%) + Doc (35%) */}
                        <div className="flex gap-2">
                            <div className="space-y-0.5 w-[65%]">
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Cliente</label>
                                <div className="flex gap-1">
                                    <select name="client" className="w-full px-2 py-1 text-xs border rounded bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-white h-7" value={formData.client} onChange={handleInputChange}>
                                        <option value="">-- Seleccionar --</option>
                                        <option value="Cliente 1">Juan Perez</option>
                                        <option value="Cliente 2">Maria Garcia</option>
                                    </select>
                                    <button
                                        className="bg-slate-700 hover:bg-slate-600 text-white rounded px-2 h-7 flex items-center justify-center transition-colors"
                                        title="Nuevo Cliente"
                                        onClick={() => alert("Función 'Agregar Cliente Rápido' próxima a ser implementada")}
                                    >
                                        <Icons.Plus size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-0.5 w-[35%]">
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Cédula/RIF</label>
                                <Input name="clientDocId" value={formData.clientDocId} onChange={handleInputChange} placeholder="V-..." className="dark:bg-slate-900 dark:border-slate-700 dark:text-white text-xs px-2 py-1 h-7" />
                            </div>
                        </div>

                        {/* Row 2: Monto, Moneda, Tasa */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Monto</label>
                                <Input name="amount" type="number" value={formData.amount} onChange={handleInputChange} placeholder="0.00" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono font-bold text-xs px-2 py-1 h-7" />
                            </div>
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Moneda</label>
                                <select name="currency" className="w-full px-1 py-1 text-xs border rounded bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-white font-bold h-7" value={formData.currency} onChange={handleInputChange}>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="VES">VES</option>
                                    <option value="USDT">USDT</option>
                                </select>
                            </div>
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Tasa</label>
                                <Input name="rate" type="number" value={formData.rate} onChange={handleInputChange} placeholder="36.5" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white text-xs px-2 py-1 h-7" />
                            </div>
                        </div>

                        {/* Row 3: Comision B, Cuenta, Ref */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Comis. Banco</label>
                                <Input name="commission" type="number" value={formData.commission} onChange={handleInputChange} placeholder="0.00" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white text-xs px-2 py-1 h-7" />
                            </div>
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Destino</label>
                                <select name="receivingAccount" className="w-full px-1 py-1 text-xs border rounded bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-white h-7" value={formData.receivingAccount} onChange={handleInputChange}>
                                    <option value="">Seleccionar</option>
                                    <option value="Banesco">Banesco</option>
                                    <option value="Mercantil">Mercantil</option>
                                    <option value="Zelle">Zelle</option>
                                    <option value="Binance">Binance</option>
                                </select>
                            </div>
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Referencia</label>
                                <Input name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Ref..." className="dark:bg-slate-900 dark:border-slate-700 dark:text-white text-xs px-2 py-1 h-7" />
                            </div>
                        </div>

                        {/* Bank Commission Toggle & Percentages - Inline */}
                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.appliesBankFee}
                                        onChange={() => {
                                            const newValue = !formData.appliesBankFee;
                                            handleInputChange({ target: { name: 'appliesBankFee', value: newValue } } as any);
                                            // Reset commission if toggled off
                                            if (!newValue) handleInputChange({ target: { name: 'commission', value: '0' } } as any);
                                        }}
                                    />
                                    <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-2 font-bold text-[9px] uppercase text-slate-500 whitespace-nowrap">Aplica Comisión?</span>
                                </label>
                            </div>

                            {formData.appliesBankFee && (
                                <div className="flex gap-1 flex-1 animate-fade-in">
                                    {['0.3%', '1.5%', '3%', 'Fixed'].map((pct) => (
                                        <button
                                            key={pct}
                                            onClick={() => {
                                                if (pct === 'Fixed') return;
                                                const percentage = parseFloat(pct.replace('%', ''));
                                                const amount = parseFloat(formData.amount || '0');
                                                const calc = (amount * percentage / 100).toFixed(2);
                                                handleInputChange({ target: { name: 'commission', value: calc } } as any);
                                            }}
                                            className={`flex-1 py-0.5 text-[9px] font-bold rounded border border-slate-700 hover:bg-slate-800 text-slate-400 transition-colors h-7 active:bg-blue-600 active:text-white`}
                                        >
                                            {pct}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className='pt-1'>
                            <textarea
                                name="notes"
                                className="w-full p-2 text-xs border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white resize-none"
                                rows={1}
                                placeholder="Notas..."
                                value={formData.notes}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" size="xs" onClick={() => setTransactionModalOpen(false)}>Cancelar</Button>
                            <Button variant="primary" size="xs" onClick={onSubmitTransaction}>
                                {isDemoMode ? 'Guardar (Demo)' : 'Guardar'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Support Modal */}
            <Modal isOpen={isSupportModalOpen} onClose={() => setSupportModalOpen(false)} title="Soporte Técnico">
                <div className="space-y-4">
                    <Input placeholder="Asunto" />
                    <textarea className="w-full p-3 border rounded text-sm dark:bg-slate-800" rows={4} placeholder="Descripción..."></textarea>
                    <Button className="w-full" icon={<Icons.Send />}>Enviar</Button>
                </div>
            </Modal>

            {/* Receipt Viewer Modal */}
            {viewerUrl && (
                <ReceiptViewerModal
                    imageUrl={viewerUrl}
                    onClose={() => setViewerUrl(null)}
                />
            )}
        </>
    );
};
