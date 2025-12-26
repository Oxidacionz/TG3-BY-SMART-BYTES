from pydantic import BaseModel
from typing import List, Dict, Any

class ChartDataPoint(BaseModel):
    name: str
    volume: float
    profit: float

class TickerData(BaseModel):
    global_rate: str
    bcv_usd: float
    bcv_eur: float
    binance_buy: float
    binance_sell: float
    zelle: float

class DashboardStats(BaseModel):
    volume: str
    net_profit: str
    pending_count: int
    ticker: TickerData
    chart_data: List[ChartDataPoint]
