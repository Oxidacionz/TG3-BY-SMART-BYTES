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
                        {/* Transaction Category Selector */}
                        <div className="flex gap-2 items-end mb-1">
                            <div className="flex-1 space-y-0.5">
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Tipo de Operación</label>
                                <select
                                    name="category"
                                    className="w-full px-2 py-1 text-xs border rounded bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-white h-7 font-bold border-l-4 border-l-indigo-500"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <optgroup label="Tesorería">
                                        <option value="CAMBIO_DIVISA">💱 Cambio de Divisa</option>
                                        <option value="TRANSFERENCIA_INTERNA">🔄 Transferencia Interna</option>
                                    </optgroup>
                                    <optgroup label="Ingresos">
                                        <option value="VENTA">💰 Venta</option>
                                        <option value="COBRO_DEUDA">📥 Cobro de Deuda</option>
                                        <option value="INYECCION_CAPITAL">🏦 Inyección Capital</option>
                                    </optgroup>
                                    <optgroup label="Egresos">
                                        <option value="GASTO_OPERATIVO">💸 Gasto Operativo</option>
                                        <option value="PAGO_PROVEEDOR">🏭 Pago Proveedor</option>
                                        <option value="NOMINA">👥 Nómina</option>
                                        <option value="RETIRO_CAPITAL">💼 Retiro Socio</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold h-7 flex items-center justify-center min-w-[60px] shadow-sm ${formData.type === 'ENTRADA' ? 'bg-green-600 text-white' :
                                formData.type === 'SALIDA' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                                }`}>
                                {formData.type}
                            </div>
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
                        <div className="grid grid-cols-4 gap-2">
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
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Tasa Op.</label>
                                <Input name="rate" type="number" value={formData.rate} onChange={handleInputChange} placeholder="36.5" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white text-xs px-2 py-1 h-7" />
                            </div>
                            <div className='space-y-0.5'>
                                <label className="font-bold text-[9px] uppercase text-slate-500 dark:text-slate-400">Tasa Mercado</label>
                                <Input name="marketRate" type="number" value={formData.marketRate} onChange={handleInputChange} placeholder="38.0" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white text-xs px-2 py-1 h-7 border-dashed" />
                            </div>
                        </div>

                        {/* Real-time Calculator Preview */}
                        <div className="flex justify-between px-1 -mt-1 mb-1">
                            <span className="text-[9px] text-slate-400">
                                {formData.profit && <span className="text-green-500 font-bold mr-2">Ganancia Est: +{formData.profit}</span>}
                                Eq USD: {formData.amountUSD || '0.00'} $
                            </span>
                            <span className="text-[9px] text-slate-400">
                                Contravalor: <span className="font-bold text-slate-300">
                                    {(parseFloat(formData.amount || '0') * (parseFloat(formData.rate) || 0) || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                </span>
                            </span>
                        </div>

                        {/* LINKED TRANSACTION BLOCK (For Currency Exchange) */}
                        {formData.category === 'CAMBIO_DIVISA' && (
                            <div className="bg-slate-900/50 p-2 rounded-lg border border-indigo-500/30 mb-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1">
                                    <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MODO CAMBIO</span>
                                </div>
                                <h4 className="text-[10px] uppercase font-bold text-indigo-300 mb-1 flex items-center gap-1">
                                    <Icons.Refresh size={10} /> Salida (Entrega)
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-0.5">
                                        <label className="font-bold text-[9px] uppercase text-slate-500">Monto A Entregar</label>
                                        <Input
                                            name="manualExitAmount"
                                            type="number"
                                            value={formData.manualExitAmount}
                                            onChange={handleInputChange}
                                            placeholder={(parseFloat(formData.amount || '0') * (parseFloat(formData.rate) || 0)).toFixed(2)}
                                            className="bg-slate-800 border-slate-700 text-red-400 font-mono font-bold text-xs px-2 py-1 h-6 w-full"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="font-bold text-[9px] uppercase text-slate-500">Cuenta Salida</label>
                                        <select className="w-full px-1 py-1 text-xs border rounded bg-slate-800 border-slate-700 text-white h-6">
                                            <option>Banesco</option>
                                            <option>Mercantil</option>
                                            <option>Efectivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

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

                        <div className="flex justify-between items-center pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" defaultChecked />
                                    <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 group-hover:text-green-600 transition-colors flex items-center gap-1">
                                    <Icons.WhatsApp size={12} /> Notificar
                                </span>
                            </label>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="xs" onClick={() => setTransactionModalOpen(false)}>Cancelar</Button>
                                <Button variant="primary" size="xs" onClick={onSubmitTransaction}>
                                    {isDemoMode ? 'Guardar (Demo)' : 'Guardar'}
                                </Button>
                            </div>
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
