import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export const useFetchData = (endpoint: string, initialValue: any) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}${endpoint}`);
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
