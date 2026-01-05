import React, { useState } from 'react';
import { Modal } from '../molecules/Modal';
import { Button } from '../atoms/Button';
import { Icons } from '../atoms/Icons';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INTERNATIONAL_BANKS = [
    { id: 'binance', name: 'Binance', icon: <Icons.Wallet /> },
    { id: 'paypal', name: 'PayPal', icon: <Icons.Wallet /> },
    { id: 'zinli', name: 'Zinli', icon: <Icons.Wallet /> },
    { id: 'zelle', name: 'Zelle', icon: <Icons.Wallet /> },
    { id: 'banesco_pa', name: 'Banesco Panamá', icon: <Icons.Bank /> },
    { id: 'mercantil_pa', name: 'Mercantil Panamá', icon: <Icons.Bank /> },
    { id: 'chase', name: 'Chase', icon: <Icons.Bank /> },
    { id: 'swift', name: 'Swift / Wire', icon: <Icons.Bank /> },
    { id: 'other_int', name: 'Otro Banco Int.', icon: <Icons.Globe /> },
];

const NATIONAL_BANKS = [
    { id: 'venezuela', name: 'Banco de Venezuela', icon: <Icons.Bank /> },
    { id: 'banesco', name: 'Banesco', icon: <Icons.Bank /> },
    { id: 'mercantil', name: 'Mercantil', icon: <Icons.Bank /> },
    { id: 'bnc', name: 'BNC', icon: <Icons.Bank /> },
    { id: 'pago_movil', name: 'Pago Móvil', icon: <Icons.Phone /> },
    { id: 'other_nat', name: 'Otro Banco Nac.', icon: <Icons.Bank /> },
];

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
    const [accountType, setAccountType] = useState<'INT' | 'NAT'>('INT');
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const handleSave = () => {
        // Here we would call the backend
        alert("Función de Guardar Cuenta en desarrollo (Conectando con Backend...)");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nueva Cuenta" size="lg">
            <div className="space-y-6">

                {/* Type Selector */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                        onClick={() => { setAccountType('INT'); setSelectedBank(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${accountType === 'INT' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Internacional / Digital
                    </button>
                    <button
                        onClick={() => { setAccountType('NAT'); setSelectedBank(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${accountType === 'NAT' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Nacional (VES)
                    </button>
                </div>

                {/* Bank Grid */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selecciona la Plataforma</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(accountType === 'INT' ? INTERNATIONAL_BANKS : NATIONAL_BANKS).map((bank) => (
                            <button
                                key={bank.id}
                                onClick={() => setSelectedBank(bank.id)}
                                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 group ${selectedBank === bank.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10 ring-1 ring-amber-500' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className={`p-2 rounded-full ${selectedBank === bank.id ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-500'}`}>
                                    {React.cloneElement(bank.icon as React.ReactElement, { size: 18 })}
                                </div>
                                <span className={`text-sm font-medium ${selectedBank === bank.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {bank.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Form (Only shows if bank selected) */}
                {selectedBank && (
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre de la Cuenta (Alias)</label>
                                <input type="text" placeholder="Ej. Banesco Principal" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Saldo Inicial</label>
                                <input type="number" placeholder="0.00" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} icon={<Icons.Check size={16} />}>
                                Registrar Cuenta
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
