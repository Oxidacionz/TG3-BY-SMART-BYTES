import { API_URL } from '../config/api';

export const transactionService = {
    createTransaction: async (data: any) => {
        const response = await fetch(`${API_URL}/transactions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Error creating transaction: ${response.statusText}`);
        }
        return response.json();
    }
};
