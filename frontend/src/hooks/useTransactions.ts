import { useState } from 'react';
import { useFetchData } from './useFetchData';
import { transactionService } from '../services/transactionService';
import { DEMO_TRANSACTIONS } from '../config/mockData';

export const useTransactions = (isDemoMode: boolean) => {
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [demoTransactions, setDemoTransactions] = useState<any[]>([]);

    const { data: rawTransactions, refetch: refetchTransactions } = useFetchData('/transactions/', []);

    // Combine new demo transactions with static mock data
    const transactions = isDemoMode ? [...demoTransactions, ...DEMO_TRANSACTIONS] : rawTransactions;

    const handleSubmitTransaction = async (formData: any, onSuccess?: () => void, shouldClose: boolean = true) => {
        if (isDemoMode) {
            const newTx = {
                ...formData,
                id: `DEMO-${Date.now()}`,
                status: 'PENDIENTE',
                date: new Date().toISOString(),
                amount: parseFloat(formData.amount) || 0,
                rate: parseFloat(formData.rate) || 0,
                commission: parseFloat(formData.commission) || 0
            };
            setDemoTransactions(prev => [newTx, ...prev]);
            alert("Operación registrada en MODO DEMO (Temporal)");
            if (shouldClose) setTransactionModalOpen(false);
            if (onSuccess) onSuccess();
            return;
        }

        try {
            await transactionService.createTransaction(formData);
            await refetchTransactions();
            if (shouldClose) setTransactionModalOpen(false);
            if (onSuccess) onSuccess();
        } catch (e) {
            console.error("Error saving transaction", e);
        }
    };

    return {
        transactions,
        isTransactionModalOpen,
        setTransactionModalOpen,
        handleSubmitTransaction,
        refetchTransactions,
        demoTransactions // Expose for now in case logic needs it explicitly
    };
};
