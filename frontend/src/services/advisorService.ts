import { API_URL } from '../config/api';

export interface ChatResponse {
    response: string;
    related_actions: string[];
}

export interface AudioResponse {
    transcript: string;
    response: string;
}

export const advisorService = {
    sendMessage: async (message: string): Promise<ChatResponse> => {
        const res = await fetch(`${API_URL}/advisor/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    },

    sendAudio: async (audioBlob: Blob): Promise<AudioResponse> => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice_query.webm');

        const res = await fetch(`${API_URL}/advisor/audio`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to send audio');
        return res.json();
    }
};
