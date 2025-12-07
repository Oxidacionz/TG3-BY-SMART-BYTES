from typing import List, Dict, Any, Optional
from app.core.config import settings
import uuid
import logging

logger = logging.getLogger(__name__)

class TransactionRepository:
    def __init__(self):
        self.use_mock = settings.USE_MOCK_DB
        self.transactions: List[Dict[str, Any]] = []
        self.clients: List[Dict[str, Any]] = [
            {'id': '1', 'name': 'Juan Perez', 'last': '28/11/2025'},
            {'id': '2', 'name': 'Maria Gomez', 'last': '27/11/2025'}
        ]
        self.operators: List[Dict[str, Any]] = [
            {'id': 'u2', 'name': 'Camello_1', 'location': 'Sucursal Centro', 'profit': 5, 'volume': 100, 'last': '28/11/2025', 'active': True},
            {'id': 'u3', 'name': 'Camello 2', 'location': 'Sucursal Norte', 'profit': 0, 'volume': 0, 'last': 'Sin actividad', 'active': False}
        ]
        
        # Initialize empty lists. Supabase connection would happen here in production mode.
        if self.use_mock:
            # We start with empty lists in mock mode, no fake data pre-population.
            pass
            
        logger.info(f"TransactionRepository initialized. Mode: {'MOCK' if self.use_mock else 'SUPABASE'}")

    async def save_transaction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Saves a transaction to the database (or mock DB).
        """
        if self.use_mock:
            if 'id' not in transaction_data:
                transaction_data['id'] = str(uuid.uuid4())[:8]
            transaction_data['status'] = transaction_data.get('status', 'Pendiente')
            self.transactions.insert(0, transaction_data) # Add to top
            logger.info(f"Transaction saved to mock DB: {transaction_data['id']}")
            return transaction_data
        else:
            from supabase_config import get_supabase_client
            client = get_supabase_client()
            if not client:
                logger.error("Supabase client unavailable")
                return transaction_data

            try:
                # Remove empty id to let DB generate UUID
                if 'id' in transaction_data and not transaction_data['id']:
                    del transaction_data['id']
                
                # Check for incompatible fields or map if necessary
                # For now assume frontend sends correct schema matching 'transactions' table
                
                res = client.table('transactions').insert(transaction_data).execute()
                
                if res.data:
                    saved = res.data[0]
                    logger.info(f"Transaction saved to Supabase: {saved.get('id')}")
                    return saved
                else:
                    logger.warning("Supabase insert returned no data")
                    return transaction_data
            except Exception as e:
                logger.error(f"Error saving transaction to Supabase: {e}")
                # Don't crash the app, return data (maybe add error flag)
                # re-raise if you want 500
                raise e

    async def get_all_transactions(self) -> List[Dict[str, Any]]:
        if self.use_mock:
            return self.transactions

        from supabase_config import get_supabase_client
        client = get_supabase_client()
        if not client:
             return []
        
        try:
             res = client.table('transactions').select("*").order('created_at', desc=True).limit(50).execute()
             return res.data if res.data else []
        except Exception as e:
             logger.error(f"Error fetching transactions: {e}")
             return []

    async def get_clients(self) -> List[Dict[str, Any]]:
        if self.use_mock:
            return self.clients
        return []

    async def get_operators(self) -> List[Dict[str, Any]]:
        if self.use_mock:
            return self.operators
        return []

    async def get_stats(self) -> Dict[str, Any]:
        """
        Calculate stats on the fly from transactions
        """
        from app.core import database_sb
        real_rates = database_sb.get_latest_rates()
        ticker_data = {}
        
        if real_rates:
            ticker_data = {
                "global_rate": f"{real_rates.get('usd_binance_sell', 0):.2f} VES", 
                "bcv_usd": real_rates.get('usd_bcv', 0),
                "bcv_eur": real_rates.get('eur_bcv', 0),
                "binance_buy": real_rates.get('usd_binance_buy', 0),
                "binance_sell": real_rates.get('usd_binance_sell', 0),
                "zelle": real_rates.get('usd_binance_sell', 0) # Placeholder for Zelle
            }
        
        if self.use_mock:
            # Simple aggregation logic
            total_vol = sum(float(t['amount']) for t in self.transactions if t.get('currency') == 'USD')
            total_profit = sum(float(t.get('profit', 0)) for t in self.transactions)
            pending = sum(1 for t in self.transactions if t.get('status') == 'Pendiente')
            
            # Chart data
            chart_data = [
              { 'name': '08:00', 'volume': 400, 'profit': 20 },
              { 'name': '10:00', 'volume': 300, 'profit': 15 },
              { 'name': '12:00', 'volume': 600, 'profit': 30 },
            ]
            
            return {
                "volume": total_vol,
                "net_profit": total_profit,
                "pending_count": pending,
                "chart_data": chart_data,
                "ticker": ticker_data if ticker_data else {
                    "global_rate": "36.00 VES",
                    "bcv_usd": 35.50,
                    "binance_buy": 36.10,
                    "binance_sell": 35.90,
                    "zelle": 36.00
                }
            }

        else:
             # REAL PRODUCTION LOGIC (Basic implementation)
             # TODO: Aggregate real stats from Supabase transactions if needed
             return {
                 "volume": 0,
                 "net_profit": 0,
                 "pending_count": 0,
                 "chart_data": [],
                 "ticker": ticker_data
             }

# Singleton instance
repo = TransactionRepository()
