import sys
import os
import uuid
from datetime import datetime, timedelta

# Ensure backend path is in sys.path
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)

from app.core.database_sb import SessionLocal
from app.models.finance import Account, CashSession, AccountType
from app.models.transaction import Transaction

def seed():
    db = SessionLocal()
    try:
        # 1. Accounts
        if not db.query(Account).first():
            print("Seeding Accounts...")
            acc_cash = Account(name="Caja Principal USD", type=AccountType.CASH, currency="USD", current_balance=1500.00)
            acc_zelle = Account(name="Zelle Corporativo", type=AccountType.BANK, currency="USD", current_balance=5000.00)
            acc_ves = Account(name="Banesco VES", type=AccountType.BANK, currency="VES", current_balance=25000.00)
            
            db.add_all([acc_cash, acc_zelle, acc_ves])
            db.commit()
            
            # Keep IDs for later
            cash_id = acc_cash.id
        else:
            print("Accounts already exist.")
            cash_id = db.query(Account).filter_by(name="Caja Principal USD").first().id

        # 2. Sessions
        if not db.query(CashSession).first():
            print("Seeding Session...")
            session = CashSession(
                user_id="ADMIN", 
                branch_id="MAIN", 
                status="OPEN",
                start_time=datetime.utcnow() - timedelta(hours=4),
                initial_balance=1000.00,
                current_balance=1500.00
            )
            db.add(session)
            db.commit()
        else:
            print("Sessions already exist.")

        # 3. Transactions (Clients)
        if not db.query(Transaction).first():
            print("Seeding Transactions...")
            # Client 1
            t1 = Transaction(
                transaction_type="ENTRADA",
                amount=200.00,
                currency="USD",
                amount_usd=200.00,
                status="COMPLETED",
                sender_name="Cliente Importante",
                transaction_date=datetime.utcnow() - timedelta(minutes=30),
                created_at=datetime.utcnow() - timedelta(minutes=30),
                account_id=cash_id,
                reference_id="REF-1001",
                platform="CASH"
            )
            # Client 2
            t2 = Transaction(
                transaction_type="ENTRADA",
                amount=500.00,
                currency="USD",
                amount_usd=500.00,
                status="COMPLETED",
                sender_name="Juan Perez",
                transaction_date=datetime.utcnow() - timedelta(days=1),
                created_at=datetime.utcnow() - timedelta(days=1),
                account_id=cash_id,
                reference_id="REF-1002",
                platform="ZELLE"
            )
             # Payment 
            t3 = Transaction(
                transaction_type="SALIDA",
                amount=100.00,
                currency="USD",
                amount_usd=100.00,
                status="COMPLETED",
                receiver_name="Proveedor Logística",
                transaction_date=datetime.utcnow() - timedelta(hours=2),
                created_at=datetime.utcnow() - timedelta(hours=2),
                account_id=cash_id,
                reference_id="PAY-500",
                platform="CASH"
            )

            db.add_all([t1, t2, t3])
            db.commit()
        else:
             print("Transactions already exist.")

        print("✅ Seeding complete.")
        
    finally:
        db.close()

if __name__ == "__main__":
    seed()
