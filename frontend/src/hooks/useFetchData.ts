import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export const useFetchData = (endpoint: string, initialValue: any) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            // Use PROXY-compatible path if endpoint typically starts with /
            const url = endpoint.startsWith('/api') ? endpoint : `/api/v1${endpoint.replace('/resources', '')}`;
            // Correct logic depends on how endpoint is passed. In App.tsx it is "/resources/clients".
            // Backend likely expects "/api/v1/clients".
            // Let's assume input "endpoint" is relative to "api/v1" or adjust logic.
            // Actually, simpler: Just use relative path and let proxy handle it.
            // If endpoint is "/resources/clients", proxy sees "/resources/clients".
            // We need to map it correctly.
            // Based on original code: `${API_URL}${endpoint}` where API_URL was http://localhost:8001/api/v1
            // So we should construct `/api/v1${endpoint}`.
            const res = await fetch(`/api/v1${endpoint}`);
            if (!res.ok) throw new Error('Network error');
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error, refetch: fetchData };
};
