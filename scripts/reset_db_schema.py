import sys
import os
from sqlalchemy import text

# Ensure backend path is in sys.path
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)

from app.core.database_sb import engine, Base
from app.models import finance, transaction

def reset():
    print("Resetting database...")
    with engine.connect() as conn:
        # Drop tables if they exist
        conn.execute(text("DROP TABLE IF EXISTS transactions"))
        conn.execute(text("DROP TABLE IF EXISTS cash_sessions"))
        conn.execute(text("DROP TABLE IF EXISTS accounts"))
        # We leave exchange_rates_local if it exists
        conn.commit()
        print("Dropped tables.")

    print("Recreating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables recreated.")

if __name__ == "__main__":
    reset()
