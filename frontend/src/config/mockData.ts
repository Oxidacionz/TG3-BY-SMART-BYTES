
// Mock data for development and demo mode

export const DEMO_STATS = {
    volume: '42,500.00',
    net_profit: '1,840.50',
    pending_count: 5,
    ticker: {
        global_rate: 36.50,
        bcv_usd: 35.80,
        bcv_eur: 38.20,
        binance_buy: 36.45,
        binance_sell: 36.60,
        zelle: 36.20
    },
    chart_data: [
        { name: 'Lun', volume: 4000, profit: 240 },
        { name: 'Mar', volume: 3000, profit: 139 },
        { name: 'Mie', volume: 2000, profit: 980 },
        { name: 'Jue', volume: 2780, profit: 390 },
        { name: 'Vie', volume: 1890, profit: 480 },
        { name: 'Sab', volume: 2390, profit: 380 },
        { name: 'Dom', volume: 3490, profit: 430 },
    ]
};

export const DEMO_CLIENTS = [
    'Alejandro Magno', 'María Lionza', 'Pedro Camejo', 'Luisa Cáceres',
    'Andrés Bello', 'Francisco Miranda', 'José Gregorio', 'Guaicaipuro', 'Negra Matea',
    'Tío Simón', 'Carolina Herrera', 'Gustavo Dudamel'
];

export const DEMO_OPERATORS = [
    { id: 'op1', name: 'Camello Alpha', avatar: '🐫', color: 'bg-blue-100 text-blue-700' },
    { id: 'op2', name: 'Camello Beta', avatar: '🐪', color: 'bg-green-100 text-green-700' },
    { id: 'op3', name: 'Camello Gamma', avatar: '🐎', color: 'bg-purple-100 text-purple-700' },
    { id: 'op4', name: 'Camello Delta', avatar: '🐫', color: 'bg-amber-100 text-amber-700' },
];

export const DEMO_TRANSACTIONS = Array.from({ length: 15 }).map((_, i) => {
    const type = Math.random() > 0.5 ? 'ENTRADA' : 'SALIDA';
    let status = 'PENDIENTE';
    if (type === 'ENTRADA') {
        status = Math.random() > 0.4 ? 'Recibido' : 'Pendiente Recepción';
    } else {
        status = Math.random() > 0.4 ? 'Pagado' : 'En Revisión';
    }

    return {
        id: `TX-DEMO-${1000 + i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toLocaleString(),
        amount: (Math.random() * 2000 + 50).toFixed(2),
        currency: Math.random() > 0.5 ? 'USD' : 'USDT',
        type,
        status,
        client: DEMO_CLIENTS[i % DEMO_CLIENTS.length],
        operator: DEMO_OPERATORS[i % DEMO_OPERATORS.length].name,
        rate: (48 + Math.random()).toFixed(2),
        profit: (Math.random() * 50).toFixed(2),
        ref: `REF-${Math.floor(Math.random() * 999999)}`,
        clientBank: ['Zelle', 'Banesco', 'Mercantil', 'Binance'][Math.floor(Math.random() * 4)]
    };
});

export const DEMO_ADMIN_NOTICES = [
    { id: 1, title: '⚠️ Mantenimiento Zelle', text: 'Zelle estará lento entre 2pm y 4pm hoy.', important: true },
    { id: 2, title: '🚀 Bonificación', text: 'El operador con más volumen recibe bono el Viernes.', important: false },
    { id: 3, title: 'Tasa BCV', text: 'Recuerden actualizar la tasa BCV en las notas de entrega.', important: false }
];

export const DEMO_PERSONAL_NOTES = [
    { id: 1, text: 'Llamar a Cliente VIP María para confirmar saldo pendiente.', done: false },
    { id: 2, text: 'Verificar transacción REF-8821 que quedó colgada.', done: true },
    { id: 3, text: 'Organizar comprobantes de la mañana.', done: false }
];

export const DEMO_MESSAGES = [
    { id: 1, sender: 'Admin', text: 'Recuerden reportar los cierres antes de las 5pm.', time: '10:30 AM', unread: true, avatar: '👑' },
    { id: 2, sender: 'Camello Alpha', text: 'Tengo un cliente con un problema en Zelle, ¿puedes revisar?', time: '09:15 AM', unread: false, avatar: '🐫' },
    { id: 3, sender: 'Soporte', text: 'El sistema estará en mantenimiento brevemente esta noche.', time: 'Ayer', unread: false, avatar: '🛠️' },
    { id: 4, sender: 'Camello Beta', text: 'Listo el reporte de la mañana.', time: 'Ayer', unread: false, avatar: '🐪' }
];
