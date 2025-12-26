import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database_sb import engine
from app.models.transaction import Base as TransactionBase
from app.models.finance import Base as FinanceBase

def init_account_book():
    print("Initializating Account Book Database...")
    
    print("Creating Transaction tables...")
    TransactionBase.metadata.create_all(bind=engine)
    
    print("Creating Finance tables (Accounts, Sessions)...")
    FinanceBase.metadata.create_all(bind=engine)
    
    print("Database initialization complete!")
    print(f"Database URL used: {engine.url}")

if __name__ == "__main__":
    init_account_book()
