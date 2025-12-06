"""
Database models and operations for exchange rates persistence
Supports both Supabase (primary) and SQLite (fallback)
"""
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from supabase_config import get_supabase_client, is_supabase_enabled

# ============================================
# SQLite Database Setup (Fallback)
# ============================================
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./exchange_rates_v3.db")

# Fix for SQLAlchemy compatibility with some providers that use postgres://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLite Models (Updated to simplify fallback, keeping it structurally similar to expected Dict)
class ExchangeRateLocal(Base):
    """Model for storing exchange rates in SQLite (Simplified cache)"""
    __tablename__ = "exchange_rates_local"
    
    id = Column(Integer, primary_key=True, index=True)
    usd_bcv = Column(Float, nullable=False)
    eur_bcv = Column(Float, nullable=False)
    usd_binance_buy = Column(Float, nullable=True)
    usd_binance_sell = Column(Float, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, nullable=False)
    source = Column(String, default="bcv.org.ve")

# ============================================
# Database Initialization
# ============================================
def init_db():
    """Initialize database tables (SQLite fallback)"""
    Base.metadata.create_all(bind=engine)
    print("✅ SQLite database tables created successfully")

# ============================================
# Supabase Operations (New Schema Adapter)
# ============================================
def save_rates_to_supabase(usd_bcv: float, eur_bcv: float, usd_binance_buy: float = None, usd_binance_sell: float = None) -> bool:
    """
    Save exchange rates to Supabase using the NEW schema (Audit Log style).
    This creates multiple rows, one for each currency pair.
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            return False
        
        rates_to_insert = []
        now = datetime.utcnow().isoformat()

        # 1. BCV USD
        if usd_bcv:
            rates_to_insert.append({
                "from_currency": "USD",
                "to_currency": "VES",
                "rate": float(usd_bcv),
                "is_buy_rate": True, # Official rate
                "captured_at": now
            })
            
        # 2. BCV EUR
        if eur_bcv:
            rates_to_insert.append({
                "from_currency": "EUR",
                "to_currency": "VES",
                "rate": float(eur_bcv),
                "is_buy_rate": True,
                "captured_at": now
            })

        # 3. Binance Buy
        if usd_binance_buy:
            rates_to_insert.append({
                "from_currency": "USDT",
                "to_currency": "VES",
                "rate": float(usd_binance_buy),
                "is_buy_rate": True, # Market Buy
                "captured_at": now
            })

        # 4. Binance Sell
        if usd_binance_sell:
            rates_to_insert.append({
                "from_currency": "USDT",
                "to_currency": "VES",
                "rate": float(usd_binance_sell),
                "is_buy_rate": False, # Market Sell
                "captured_at": now
            })

        if not rates_to_insert:
            return False
        
        # Batch insert
        result = supabase.table("exchange_rates").insert(rates_to_insert).execute()
        
        if result.data:
            print(f"✅ Rates saved to Supabase (New Schema): {len(result.data)} rows.")
            return True
        else:
            print("⚠️  Supabase insert returned no data")
            return False
            
    except Exception as e:
        print(f"❌ Error saving rates to Supabase: {e}")
        return False

def get_rates_from_supabase() -> dict | None:
    """
    Get latest rates from Supabase and flatten them into the expected dictionary format.
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            return None
        
        # Fetch last 20 rates to ensure we cover all pairs
        result = supabase.table("exchange_rates") \
            .select("*") \
            .is_("user_id", "null") \
            .order("captured_at", desc=True) \
            .limit(20) \
            .execute()
        
        if not result.data:
            return None
            
        rates_data = result.data
        
        # Flatten logic
        # We need to find the latest entry for each category
        
        output = {
            "usd_bcv": 0.0,
            "eur_bcv": 0.0,
            "usd_binance_buy": 0.0,
            "usd_binance_sell": 0.0,
            "last_updated": None,
            "source": "Supabase"
        }
        
        latest_time = None

        for row in rates_data:
            fc = row.get("from_currency")
            tc = row.get("to_currency")
            buy = row.get("is_buy_rate")
            rate = row.get("rate")
            t.date = row.get("captured_at")
            
            # Update latest time found
             # (Simple comparison string isoformat works for basic latest check)
            if output["last_updated"] is None:
                output["last_updated"] = t.date
            
            # BCV USD (USD -> VES) - Assuming BCV if generic USD-VES
            # Caution: If we have multiple sources for USD-VES (e.g. Parallel), we need a 'source' column or convention.
            # Current schema has no 'source' column in exchange_rates table??
            # Let's assume standard system insertions are BCV/Binance based on currency types.
            
            if fc == "USD" and tc == "VES" and output["usd_bcv"] == 0:
                output["usd_bcv"] = rate
            elif fc == "EUR" and tc == "VES" and output["eur_bcv"] == 0:
                output["eur_bcv"] = rate
            elif fc == "USDT" and tc == "VES":
                if buy and output["usd_binance_buy"] == 0:
                     output["usd_binance_buy"] = rate
                elif not buy and output["usd_binance_sell"] == 0:
                     output["usd_binance_sell"] = rate

        return output
        
    except Exception as e:
        print(f"❌ Error retrieving rates from Supabase: {e}")
        return None

# ============================================
# SQLite Operations (Fallback)
# ============================================
def get_db():
    pass # Not used directly

def save_rates_to_sqlite(usd_bcv: float, eur_bcv: float, usd_binance_buy: float = None, usd_binance_sell: float = None):
    """
    Save exchange rates to SQLite (fallback)
    """
    db = SessionLocal()
    try:
        rate = ExchangeRateLocal(
            usd_bcv=usd_bcv,
            eur_bcv=eur_bcv,
            usd_binance_buy=usd_binance_buy,
            usd_binance_sell=usd_binance_sell,
            last_updated=datetime.now()
        )
        db.add(rate)
        db.commit()
        print(f"✅ Rates saved to SQLite: USD={usd_bcv}")
    except Exception as e:
        print(f"❌ Error saving rates to SQLite: {e}")
    finally:
        db.close()

def get_rates_dict_from_sqlite():
    """
    Get latest rates from SQLite as a dictionary
    """
    db = SessionLocal()
    try:
        rate = db.query(ExchangeRateLocal).order_by(ExchangeRateLocal.last_updated.desc()).first()
        if rate:
            return {
                "usd_bcv": rate.usd_bcv,
                "eur_bcv": rate.eur_bcv,
                "usd_binance_buy": rate.usd_binance_buy,
                "usd_binance_sell": rate.usd_binance_sell,
                "last_updated": rate.last_updated.isoformat(),
                "source": "SQLite Fallback"
            }
        return None
    except Exception:
        return None
    finally:
        db.close()

# ============================================
# Unified Interface
# ============================================
def save_rates(usd_bcv: float, eur_bcv: float, usd_binance_buy: float = None, usd_binance_sell: float = None):
    # Try Supabase first
    if is_supabase_enabled():
        success = save_rates_to_supabase(usd_bcv, eur_bcv, usd_binance_buy, usd_binance_sell)
        # We can also save to SQLite as backup or cache
        try:
             save_rates_to_sqlite(usd_bcv, eur_bcv, usd_binance_buy, usd_binance_sell)
        except:
            pass
        return
    
    # Fallback
    save_rates_to_sqlite(usd_bcv, eur_bcv, usd_binance_buy, usd_binance_sell)

def get_latest_rates():
    # Try Supabase first
    if is_supabase_enabled():
        rates = get_rates_from_supabase()
        if rates:
            return rates
    
    # Fallback
    return get_rates_dict_from_sqlite()

def get_rates_dict():
    return get_latest_rates()

if __name__ == "__main__":
    init_db()

