import React, { useState } from 'react';
import { validateGeminiResponse } from '../types/schemas';

export const useScannerForm = () => {
    const initialFormState = {
        type: 'ENTRADA',
        operator: 'Camello_1',
        client: '',
        clientDocId: '',
        amount: '',
        currency: 'USD',
        rate: '36.00',
        commission: '',
        receivingAccount: '',
        bankOrigin: '',
        reference: '',
        notes: '',
        appliesBankFee: false,
        bankFeePercentage: '0.30'
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-calculate 3% commission for National Interbank Outgoing Trasnfers
            if (name === 'type' && value === 'SALIDA') {
                const isNational = ['VES', 'Bs', 'Bolivares'].includes(newData.currency); // Simple check
                const isInterbank = newData.bankOrigin && newData.receivingAccount &&
                    !newData.bankOrigin.toLowerCase().includes(newData.receivingAccount.toLowerCase()) &&
                    !newData.receivingAccount.toLowerCase().includes(newData.bankOrigin.toLowerCase());

                if (isNational && isInterbank) {
                    const amount = parseFloat(newData.amount || '0');
                    newData.appliesBankFee = true;
                    newData.commission = (amount * 0.03).toFixed(2);
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
