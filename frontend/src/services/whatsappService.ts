
// Service to handle WhatsApp notifications via n8n Webhooks

// URL del Webhook de n8n (Ajustar según la configuración real en n8n)
// Por defecto n8n corre en puerto 5678.
const N8N_WEBHOOK_BASE = 'http://localhost:5678/webhook';

export const whatsappService = {
    /**
     * Envía una notificación de transacción a través de n8n.
     * n8n procesará esto y lo enviará vía WAHA a WhatsApp.
     */
    notifyTransaction: async (transaction: any) => {
        try {
            const response = await fetch(`${N8N_WEBHOOK_BASE}/transaction-alert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: 'NEW_TRANSACTION',
                    timestamp: new Date().toISOString(),
                    data: transaction
                })
            });

            if (!response.ok) {
                // Warn but don't break the app flow usually
                console.warn('Failed to trigger n8n webhook', response.statusText);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error contacting n8n service:', error);
            return false;
        }
    },

    /**
     * Envía un reporte diario/resumen
     */
    sendDailyReport: async (stats: any) => {
        try {
            await fetch(`${N8N_WEBHOOK_BASE}/daily-report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'DAILY_REPORT',
                    stats
                })
            });
        } catch (error) {
            console.error('Error sending report to n8n:', error);
        }
    }
};
