import React, { useState } from 'react';
import { validateGeminiResponse } from '../types/schemas';

export const useScannerForm = () => {
    const initialFormState = {
        type: 'NEUTRO',
        category: 'CAMBIO_DIVISA',
        status: 'PENDING',
        operator: 'Camello_1',
        client: '',
        clientDocId: '',
        amount: '',
        currency: 'USD',
        rate: '36.00',
        marketRate: '', // New field for spread calc
        profit: '', // New field for estimated profit
        manualExitAmount: '', // New field for explicit exit amount
        exitCurrency: 'VES', // New field for exit currency
        commission: '',
        receivingAccount: '',
        bankOrigin: '',
        reference: '',
        notes: '',
        appliesBankFee: false,
        bankFeePercentage: '0.30',
        relatedTransactionId: '',
        amountUSD: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-set Type based on Category
            if (name === 'category') {
                const cat = value;
                if (['VENTA', 'COBRO_DEUDA', 'INYECCION_CAPITAL'].includes(cat)) newData.type = 'ENTRADA';
                if (['GASTO_OPERATIVO', 'PAGO_PROVEEDOR', 'NOMINA', 'RETIRO_CAPITAL'].includes(cat)) newData.type = 'SALIDA';
                if (['CAMBIO_DIVISA', 'TRANSFERENCIA_INTERNA'].includes(cat)) newData.type = 'NEUTRO';
            }

            // Auto-calculate amounts & Profit
            if (['amount', 'rate', 'currency', 'marketRate', 'category'].includes(name)) {
                const amt = parseFloat(newData.amount || '0');
                const rate = parseFloat(newData.rate || '0');
                const mRate = parseFloat(newData.marketRate || '0');

                if (amt && rate) {
                    newData.amountUSD = (newData.currency === 'USD' || newData.currency === 'USDT')
                        ? String(amt)
                        : (amt / rate).toFixed(2);

                    // Default Exit Amount (if not set manually later)
                    // Note: manualExitAmount is separate state, if empty we might show calculated in UI
                }

                if (amt && rate && mRate && newData.category === 'CAMBIO_DIVISA') {
                    // Spread Profit Calculation
                    // Profit = (Amount * OperationRate) - (Amount * MarketRate) if selling USD
                    // Simplified: Profit = Amount * (OpRate - MarketRate) (Logic depends on direction)
                    // Assuming standard: Buying USD (Client gives VES, gets USD) -> Profit in VES?
                    // Let's assume standard Exchange: Recieve Amount (Input) -> Give Exit Amount (Output)
                    // We'll calculate profit based on difference between Rate and MarketRate
                    const spread = Math.abs(rate - mRate);
                    const profitCalc = (amt * spread).toFixed(2);
                    newData.profit = profitCalc;
                }
            }

            return newData;
        });
    };

    const handleToggleBankFee = () => {
        setFormData(prev => ({ ...prev, appliesBankFee: !prev.appliesBankFee }));
    };

    const handleScanComplete = (data: any) => {
        // Normalización robusta de datos (Backend Nuevo vs Viejo)
        // Intentamos mapear campos del backend nuevo (amount, reference_id) 
        // y del viejo (monto, referencia) por compatibilidad.

        const normalizeBank = (bankName: string | null) => {
            if (!bankName) return '';
            const lower = bankName.toLowerCase();
            if (lower.includes('banesco')) return 'Banesco';
            if (lower.includes('mercantil')) return 'Mercantil';
            if (lower.includes('venezuela') || lower.includes('bdv')) return 'Venezuela'; // Adjust to match select if needed
            if (lower.includes('provincial')) return 'Provincial'; // Add to select if missing
            if (lower.includes('zelle')) return 'Zelle';
            if (lower.includes('binance')) return 'Binance';
            return bankName;
        };

        const mappedData = {
            amount: data.amount ?? data.monto,
            reference: data.reference_id ?? data.referencia,
            bankOrigin: normalizeBank(data.sender_bank ?? data.platform), // Source is Sender Bank
            currency: data.currency ?? data.moneda,
            notes: data.raw_text_snippet ?? data.raw_text ?? '',
            client: data.sender_name ?? data.receiver_name ?? '', // Fallback to receiver name if sender missing
            // Prioritize sender ID, then receiver ID (RIF/Cedula)
            clientDocId: data.sender_doc_id ?? data.receiver_doc_id ?? '',
            commission: data.transaction_fee ?? '',
            receivingAccount: normalizeBank(data.receiver_bank), // Dest is Receiver Bank
            // Check for manual review flags
            requiresReview: data.requires_manual_review ?? false,
            reviewReason: data.manual_review_reason ?? ''
        };

        console.log('📝 Rellenando formulario con:', mappedData);

        // Construct notes with warning if review needed
        let finalNotes = mappedData.notes;

        // Debugging / Fallback: If we have an ID but it didn't land in clientDocId, put it in notes
        if (data.receiver_doc_id && mappedData.clientDocId !== data.receiver_doc_id) {
            finalNotes = `ID Detectado: ${data.receiver_doc_id}\n` + finalNotes;
        }

        if (mappedData.requiresReview) {
            finalNotes = `⚠️ REVISAR: ${mappedData.reviewReason || 'Datos dudosos'} \n` + finalNotes;
        }

        setFormData(prev => {
            const nextState = {
                ...prev,
                amount: mappedData.amount ? String(mappedData.amount) : prev.amount,
                reference: mappedData.reference ? String(mappedData.reference) : prev.reference,
                bankOrigin: mappedData.bankOrigin ? String(mappedData.bankOrigin) : prev.bankOrigin,
                currency: mappedData.currency ? String(mappedData.currency) : prev.currency,
                client: mappedData.client ? String(mappedData.client) : prev.client,
                clientDocId: mappedData.clientDocId ? String(mappedData.clientDocId) : prev.clientDocId,
                commission: mappedData.commission ? String(mappedData.commission) : prev.commission,
                appliesBankFee: !!mappedData.commission || prev.appliesBankFee,
                receivingAccount: mappedData.receivingAccount ? String(mappedData.receivingAccount) : prev.receivingAccount,
                notes: finalNotes.substring(0, 200), // Increased length limit
            };

            // Commission Logic for Scan
            if (nextState.type === 'SALIDA') {
                // Check if different banks (ignoring case)
                const origin = nextState.bankOrigin.toLowerCase();
                const dest = nextState.receivingAccount.toLowerCase();
                const isNational = nextState.currency === 'VES'; // Only apply for VES usually? User said "bancos nacionales"

                if (origin && dest && origin !== dest && isNational) {
                    const amt = parseFloat(nextState.amount || '0');
                    nextState.appliesBankFee = true;
                    nextState.commission = String((amt * 0.03).toFixed(2));
                }
            }

            return nextState;
        });
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    return {
        formData,
        setFormData,
        handleInputChange,
        handleToggleBankFee,
        handleScanComplete,
        resetForm
    };
};
