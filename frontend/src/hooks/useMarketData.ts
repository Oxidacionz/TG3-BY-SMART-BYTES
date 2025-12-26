import { useState } from 'react';
import { useFetchData } from './useFetchData';
import { ratesService } from '../services/ratesService';
import { DEMO_STATS } from '../config/mockData';

export const useMarketData = (isDemoMode: boolean) => {
    const { data: rawStats, refetch: refetchStats } = useFetchData('/stats/', { chart_data: [], ticker: { global_rate: "---", bcv_usd: "---", binance_buy: "---", binance_sell: "---", zelle: "---" }, volume: 0, net_profit: 0, pending_count: 0 });
    const [isRefreshingRates, setIsRefreshingRates] = useState(false);

    const stats = isDemoMode ? DEMO_STATS : rawStats;

    const handleRefreshRates = async () => {
        setIsRefreshingRates(true);
        try {
            await ratesService.forceRefresh();
            setTimeout(() => refetchStats(), 1000);
        } catch (e) {
            console.error("Error refreshing rates", e);
        } finally {
            setIsRefreshingRates(false);
        }
    };

    return {
        stats,
        isRefreshingRates,
        handleRefreshRates,
        refetchStats: refetchStats
    };
};
