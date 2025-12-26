export interface Transaction {
    id: string;
    date: string;
    amount: string;
    currency: string;
    type: 'ENTRADA' | 'SALIDA' | string;
    status: string;
    client: string;
    operator: string;
    rate: string;
    profit: string;
    ref: string;
    clientBank: string;
}

export interface Operator {
    id: string;
    name: string;
    avatar: string;
    color: string;
}

export interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    unread: boolean;
    avatar: string;
}

export interface Stats {
    volume: string;
    net_profit: string;
    pending_count: number;
    ticker: {
        global_rate: number | string;
        bcv_usd: number | string;
        bcv_eur: number | string;
        binance_buy: number | string;
        binance_sell: number | string;
        zelle: number | string;
    };
    chart_data: Array<{
        name: string;
        volume: number;
        profit: number;
    }>;
}
