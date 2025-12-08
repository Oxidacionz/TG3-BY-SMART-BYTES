import { API_URL } from '../config/api';

export const ratesService = {
    forceRefresh: async () => {
        const response = await fetch(`${API_URL}/rates/force-refresh`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`Error refreshing rates: ${response.statusText}`);
        }
        return response.json();
    }
};
