from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime, timedelta
from src.shared.config.settings import settings
from src.shared.config.supabase_client import get_supabase_client
from src.transactions.domain.transaction import Transaction
from app.core.database_sb import SessionLocal
from app.models.transaction import Transaction as TransactionModel

logger = logging.getLogger(__name__)

class TransactionRepository:
    def __init__(self):
        self.use_mock = settings.USE_MOCK_DB
        self.transactions_mock: List[Dict[str, Any]] = []

    async def save(self, transaction: Transaction) -> Transaction:
        # 1. Try SQLite (Primary for this session as requested)
        try:
            db = SessionLocal()
            tx_data = transaction.model_dump(exclude_unset=True)
            
            # Remove Pydantic-only fields if they don't exist in SQL model, or ensure mapping
            # (Assuming strict mapping for now, but safety first)
            sql_tx = TransactionModel(**tx_data)
            
            # Ensure ID
            if not sql_tx.id:
                sql_tx.id = str(uuid.uuid4())
                
            db.add(sql_tx)
            db.commit()
            db.refresh(sql_tx)
            db.close()
            logger.info(f"Transaction saved to SQLite: {sql_tx.id}")
            return transaction # Return the input for now, or fetch fresh
        except Exception as e:
            logger.error(f"Error saving to SQLite: {e}")
            # Fallback or persist error? For now, continue to Supabase check
            pass

        # 2. Supabase (Legacy/Production)
        client = get_supabase_client()
        if client:
             try:
                 transaction_dict = transaction.model_dump(exclude_unset=True)
                 transaction_dict['amount'] = float(transaction_dict['amount']) # Serializaton fix
                 if transaction_dict.get('transaction_date'):
                    transaction_dict['transaction_date'] = transaction_dict['transaction_date'].isoformat()
                 
                 res = client.table('transactions').insert(transaction_dict).execute()
                 if res.data:
                     return Transaction(**res.data[0])
             except Exception as e:
                 logger.error(f"Error saving transaction to Supabase: {e}")
        
        return transaction

    async def get_all(self, limit: int = 50) -> List[Transaction]:
        # 1. SQLite Fetch
        transactions = []
        try:
            db = SessionLocal()
            # Eager load? For now just simple select
            sql_txs = db.query(TransactionModel).order_by(TransactionModel.created_at.desc()).limit(limit).all()
            
            for sql_tx in sql_txs:
                # Map SQL Model -> Pydantic Domain
                # Handle Decimal -> Float conversion if Pydantic expects float, or compatible types
                t_dict = sql_tx.to_dict()
                
                # Ensure Pydantic compatibility
                # Field mapping (SQL 'type' vs Domain 'transaction_type' etc if naming differs)
                # In this case, we updated SQL model to match new requirements, but let's be safe
                
                # Fix specific fields if needed
                if 'transaction_type' not in t_dict and 'type' in t_dict:
                     t_dict['transaction_type'] = t_dict.pop('type')
                
                try:
                    transactions.append(Transaction(**t_dict))
                except Exception as map_err:
                    logger.warning(f"Skipping malformed tx {sql_tx.id}: {map_err}")
            
            db.close()
            
            if transactions:
                return transactions
                
        except Exception as e:
             logger.error(f"Error fetching from SQLite: {e}")

        # 2. Mock Fallback
        if self.use_mock:
            return [Transaction(**t) for t in self.transactions_mock]

        return []

    async def get_clients(self) -> List[Dict[str, Any]]:
        try:
            db = SessionLocal()
            # Fetch all incoming transactions to aggregate stats
            txs = db.query(TransactionModel).filter(TransactionModel.transaction_type == 'ENTRADA').all()
            
            clients_map = {}
            for tx in txs:
                name = tx.sender_name
                if not name:
                    continue
                    
                if name not in clients_map:
                    clients_map[name] = {
                        "name": name,
                        "id": f"CLI-{len(clients_map)+1}", 
                        "volume": 0.0,
                        "deals": 0,
                        "last_dt": tx.created_at or tx.transaction_date or datetime.min,
                        "last": "N/A"
                    }
                
                client = clients_map[name]
                client["volume"] += float(tx.amount_usd or 0)
                client["deals"] += 1
                
                tx_dt = tx.created_at or tx.transaction_date
                if tx_dt and tx_dt > client["last_dt"]:
                    client["last_dt"] = tx_dt

            # Format results
            results = []
            now = datetime.utcnow()
            for client in clients_map.values():
                # Format 'last' string
                diff = now - client["last_dt"]
                if diff.days > 0:
                    last_str = f"{diff.days}d ago"
                else:
                    hours = diff.seconds // 3600
                    last_str = f"{hours}h ago"
                
                results.append({
                    "name": client["name"],
                    "id": client["id"],
                    "volume": f"{client['volume']:.2f}",
                    "deals": client["deals"],
                    "last": last_str
                })
            
            db.close()
            return results 
        except Exception as e:
            logger.error(f"Error fetching clients from SQLite: {e}")
            return []

    async def get_operators(self) -> List[Dict[str, Any]]:
        try:
            db = SessionLocal()
            # Get unique user_ids from sessions
            from app.models.finance import CashSession
            sessions = db.query(CashSession.user_id).distinct().all()
            
            operators = []
            for row in sessions:
                uid = row[0]
                # Mock avatar/name logic since we don't have a Users table yet
                name = "Admin Principal" if "admin" in uid else "Operador Caja"
                avatar = "👑" if "admin" in uid else "🐫"
                color = "bg-purple-100 text-purple-700" if "admin" in uid else "bg-blue-100 text-blue-700"
                
                operators.append({
                    "id": uid,
                    "name": name,
                    "avatar": avatar,
                })
            
            db.close()
            return operators
        except Exception as e:
            logger.error(f"Error fetching operators from SQLite: {e}")
            return []

    async def get_stats(self) -> Dict[str, Any]:
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
                        
                        # Simple profit logic
                        if t.transaction_type == 'ENTRADA':
                             day_prof += amt * 0.05 # Mock 5%
                        else:
                             day_prof -= amt * 0.01 # Mock cost
                
                chart_data.append({
                    "name": day_name,
                    "volume": float(f"{day_vol:.2f}"),
                    "profit": float(f"{day_prof:.2f}")
                })

            # Ticker (Mock rates for now or fetch from DB if we had Rate table)
            ticker_data = {
                "global_rate": "58.50 VES",
                "bcv_usd": 45.80,
                "bcv_eur": 48.20,
                "binance_buy": 58.45,
                "binance_sell": 58.60,
                "zelle": 58.20
            }

            db.close()
            
            return {
                "volume": f"{total_vol:,.2f}",
                "net_profit": f"{total_vol * 0.03:,.2f}", # Mock 3%
                "pending_count": pending,
                "ticker": ticker_data,
                "chart_data": chart_data
            }
        except Exception as e:
            logger.error(f"Error fetching stats from SQLite: {e}")
            return {}

    async def get_by_client(self, client_identifier: str) -> List[Transaction]:
        """Fetch transactions for a specific client (by ID or Name)"""
        try:
            db = SessionLocal()
            # Search by exact Client ID OR Fuzzy Name match in sender/receiver
            search = f"%{client_identifier}%"
            sql_txs = db.query(TransactionModel).filter(
                (TransactionModel.client_id == client_identifier) | 
                (TransactionModel.sender_name.ilike(search)) |
                (TransactionModel.receiver_name.ilike(search))
            ).order_by(TransactionModel.created_at.desc()).all()
            
            transactions = []
            for sql_tx in sql_txs:
                try:
                    t_dict = sql_tx.to_dict()
                    if 'transaction_type' not in t_dict and 'type' in t_dict:
                        t_dict['transaction_type'] = t_dict.pop('type')
                    transactions.append(Transaction(**t_dict))
                except Exception as e:
                    logger.warning(f"Skipping tx {sql_tx.id}: {e}")
            
            db.close()
            return transactions
        except Exception as e:
            logger.error(f"Error fetching client txs: {e}")
            return []

# Singleton
transaction_repo = TransactionRepository()

