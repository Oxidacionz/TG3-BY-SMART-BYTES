from datetime import datetime, timedelta
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.core.database_sb import SessionLocal
from app.models.transaction import Transaction as TransactionModel
from src.dashboard.domain.schemas import DashboardStats, ChartDataPoint, TickerData

class DashboardService:
    def get_stats(self) -> DashboardStats:
        try:
            db = SessionLocal()
            # Fetch all txs
            txs = db.query(TransactionModel).all()
            
            total_vol = sum(float(t.amount_usd or 0) for t in txs)
            
            # Pending
            pending = sum(1 for t in txs if t.status == 'PENDING')
            
            # Chart Data: Last 7 days (fill gaps)
            today = datetime.utcnow().date()
            chart_data = []
            
            # Helper for Spanish days
            days_es = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
            
            for i in range(6, -1, -1):
                date_cursor = today - timedelta(days=i)
                day_name = days_es[date_cursor.weekday()] # 0=Mon, 6=Sun
                
                # Filter txs for this day
                day_vol = 0.0
                day_prof = 0.0
                
                for t in txs:
                    t_dt = (t.created_at or t.transaction_date or datetime.utcnow()).date()
                    if t_dt == date_cursor:
                        amt = float(t.amount_usd or 0)
                        day_vol += amt
                        
                        # Simple profit logic (Mock 5% for IN, -1% for OUT)
                        if t.transaction_type == 'ENTRADA':
                             day_prof += amt * 0.05 
                        else:
                             day_prof -= amt * 0.01 
                
                chart_data.append(ChartDataPoint(
                    name=day_name,
                    volume=float(f"{day_vol:.2f}"),
                    profit=float(f"{day_prof:.2f}")
                ))

            # Ticker (Mock rates for now, can be connected to Finance module later)
            ticker_data = TickerData(
                global_rate="58.50 VES",
                bcv_usd=45.80,
                bcv_eur=48.20,
                binance_buy=58.45,
                binance_sell=58.60,
                zelle=58.20
            )

            db.close()
            
            return DashboardStats(
                volume=f"{total_vol:,.2f}",
                net_profit=f"{total_vol * 0.03:,.2f}", # Mock total profit logic
                pending_count=pending,
                ticker=ticker_data,
                chart_data=chart_data
            )
        except Exception as e:
            print(f"Error fetching stats: {e}")
            # Return empty/safe default
            return DashboardStats(
                volume="0.00", net_profit="0.00", pending_count=0,
                ticker=TickerData(global_rate="0.0", bcv_usd=0, bcv_eur=0, binance_buy=0, binance_sell=0, zelle=0),
                chart_data=[]
            )
