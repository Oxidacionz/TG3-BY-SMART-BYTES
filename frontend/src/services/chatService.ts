import { API_URL } from '../config/api';

export interface ChatMessage {
    id: number;
    sender_id: string;
    sender_name: string;
    sender_avatar: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

export interface InboxItem {
    contact_id: string;
    contact_name: string;
    avatar: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    status: 'online' | 'offline';
}

export const chatService = {
    getInbox: async (): Promise<InboxItem[]> => {
        const res = await fetch(`${API_URL}/chat/inbox`);
        if (!res.ok) throw new Error('Failed to fetch inbox');
        return res.json();
    },

    getConversation: async (contactId: string): Promise<ChatMessage[]> => {
        const res = await fetch(`${API_URL}/chat/conversation/${contactId}`);
        if (!res.ok) throw new Error('Failed to fetch conversation');
        return res.json();
    },

    sendMessage: async (receiverId: string, content: string): Promise<ChatMessage> => {
        const res = await fetch(`${API_URL}/chat/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver_id: receiverId, content }),
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    }
};
