import sys
import os
import random
from datetime import datetime, timedelta
from decimal import Decimal

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database_sb import engine, SessionLocal
from app.models.finance import Account, CashSession, AccountType
from app.models.transaction import Transaction

def seed_full_data():
    db = SessionLocal()
    
    print(" Cleaning old data (optional)...")
    try:
        db.query(Transaction).delete()
        db.query(CashSession).delete()
        db.query(Account).delete()
        db.commit()
    except Exception as e:
        print(f"Cleanup skipped or error: {e}")
        db.rollback()

    print(" Creating Financial Accounts...")
    
    # 1. Accounts
    accounts = [
        Account(name="Caja Principal (Efectivo)", type=AccountType.CASH, currency="USD", current_balance=500.00, branch_id="MAIN"),
        Account(name="Banesco P.Juridica", type=AccountType.BANK, currency="VES", current_balance=15000.00, branch_id="MAIN"),
        Account(name="Zelle Toro Group", type=AccountType.EWALLET, currency="USD", current_balance=3250.00, branch_id="MAIN"),
        Account(name="Binance USDT (Fondo)", type=AccountType.CRYPTO, currency="USDT", current_balance=1000.00, branch_id="MAIN"),
        Account(name="Caja Chica (Admin)", type=AccountType.CASH, currency="USD", current_balance=150.00, branch_id="ADMIN"),
    ]
    
    db.add_all(accounts)
    db.commit()
    
    # Reload accounts to get IDs
    acc_map = {acc.name: acc for acc in db.query(Account).all()}

    print(" Creating Cash Sessions...")
    
    # 2. Sessions (One closed yesterday, one open today)
    yesterday = datetime.utcnow() - timedelta(days=1)
    
    session_closed = CashSession(
        user_id="user_admin_01",
        branch_id="MAIN",
        status="CLOSED",
        start_time=yesterday.replace(hour=8, minute=0),
        end_time=yesterday.replace(hour=18, minute=0),
        initial_balance=0.00,
        current_balance=450.00,
        final_balance=450.00,
        notes="Cierre sin novedades."
    )
    
    session_open = CashSession(
        user_id="user_operator_02",
        branch_id="MAIN",
        status="OPEN",
        start_time=datetime.utcnow().replace(hour=8, minute=0),
        initial_balance=450.00,
        current_balance=450.00, # Will update with txs
        notes="Apertura normal."
    )
    
    db.add(session_closed)
    db.add(session_open)
    db.commit()
    
    # 3. Transactions (Linking dots: Income, Expenses, transfers)
    print(" Creating Transactions...")
    
    txs = []
    
    # A. Income (Ventas) linked to Clients
    # Need mock client names in sender_name/receiver_name since we don't have a Client model in this specific file yet, 
    # but the frontend uses 'sender_name' effectively.
    
    # Transaction 1: Zelle Income (Completed)
    txs.append(Transaction(
        platform="ZELLE",
        amount=150.00,
        currency="USD",
        category="Venta",
        transaction_type="ENTRADA",
        status="COMPLETED",
        account_id=acc_map["Zelle Toro Group"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=150.00,
        net_amount=150.00,
        sender_name="Carlos Cliente",
        receiver_name="Toro Group LLC",
        reference_id="ZLL-001-999",
        transaction_date=datetime.utcnow() - timedelta(hours=2)
    ))
    
    # Transaction 2: Pago Movil Income (Completed) - Requires conversion
    rate_ves = 60.50
    amount_ves = 3025.00 # ~50 USD
    txs.append(Transaction(
        platform="PAGO_MOVIL",
        amount=amount_ves,
        currency="VES",
        category="Venta",
        transaction_type="ENTRADA",
        status="COMPLETED",
        account_id=acc_map["Banesco P.Juridica"].id,
        session_id=session_open.id,
        exchange_rate=rate_ves,
        amount_usd=50.00,
        net_amount=amount_ves,
        sender_name="Maria Mercantil",
        receiver_name="Toro Group Vzla",
        reference_id="PM-123456",
        transaction_date=datetime.utcnow() - timedelta(hours=1)
    ))

    # B. Operating Expenses (Gastos Operativos)
    # Transaction 3: Payment to Provider (Banesco)
    txs.append(Transaction(
        platform="BANESCO_VE",
        amount=1200.00,
        currency="VES",
        category="Gasto Operativo", # Pago Internet
        transaction_type="SALIDA",
        status="COMPLETED",
        account_id=acc_map["Banesco P.Juridica"].id,
        session_id=session_open.id,
        exchange_rate=rate_ves,
        amount_usd=19.83,
        net_amount=1200.00,
        sender_name="Toro Group Vzla",
        receiver_name="CANTV / Provider",
        reference_id="PAY-CANTV-01",
        transaction_date=datetime.utcnow() - timedelta(minutes=45)
    ))
    
    # C. Owner Withdrawal (Retiro Personal)
    txs.append(Transaction(
        platform="CASH",
        amount=50.00,
        currency="USD",
        category="Retiro Socio",
        transaction_type="SALIDA",
        status="COMPLETED",
        account_id=acc_map["Caja Principal (Efectivo)"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=50.00,
        net_amount=50.00,
        sender_name="Caja Principal",
        receiver_name="Dueño / Owner",
        reference_id="WDR-001",
        transaction_date=datetime.utcnow() - timedelta(minutes=30)
    ))

    # D. Compra de Divisas (Transfer Internal)
    # Step 1: Out VES
    ves_out = 6050.00 # 100 USD
    txs.append(Transaction(
        platform="BANESCO_VE",
        amount=ves_out,
        currency="VES",
        category="Compra Divisa",
        transaction_type="SALIDA",
        status="COMPLETED",
        account_id=acc_map["Banesco P.Juridica"].id,
        session_id=session_open.id,
        exchange_rate=rate_ves,
        amount_usd=100.00,
        net_amount=ves_out,
        sender_name="Toro Group Vzla",
        receiver_name="Camello Exchange",
        reference_id="EXCH-OUT-001",
        transaction_date=datetime.utcnow() - timedelta(minutes=10)
    ))
    
    # Step 2: In USDT (Binance)
    txs.append(Transaction(
        platform="BINANCE",
        amount=100.00,
        currency="USDT",
        category="Compra Divisa",
        transaction_type="ENTRADA",
        status="COMPLETED",
        account_id=acc_map["Binance USDT (Fondo)"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=100.00,
        net_amount=100.00,
        sender_name="Camello Exchange",
        receiver_name="Toro Group Binance",
        reference_id="EXCH-IN-001",
        transaction_date=datetime.utcnow() - timedelta(minutes=9)
    ))
    
    # E. Deuda (Venta a Credito)
    txs.append(Transaction(
        platform="ZELLE",
        amount=200.00,
        currency="USD",
        category="Venta",
        transaction_type="ENTRADA",
        status="PENDING", # Credito, no afecta saldo aun
        account_id=acc_map["Zelle Toro Group"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=200.00,
        net_amount=200.00,
        sender_name="Cliente Fiado",
        receiver_name="Toro Group",
        reference_id="CREDIT-001",
        transaction_date=datetime.utcnow()
    ))
    
    # F. Nomina (Workers)
    txs.append(Transaction(
        platform="CASH",
        amount=30.00,
        currency="USD",
        category="Nomina",
        transaction_type="SALIDA",
        status="COMPLETED",
        account_id=acc_map["Caja Principal (Efectivo)"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=30.00,
        net_amount=30.00,
        sender_name="Toro Group",
        receiver_name="Juan Empleado",
        reference_id="PAYROLL-001",
        transaction_date=datetime.utcnow() - timedelta(hours=3)
    ))

    # G. Consumo Personal Admin
    txs.append(Transaction(
        platform="ZELLE",
        amount=45.50,
        currency="USD",
        category="Retiro Socio",
        transaction_type="SALIDA",
        status="COMPLETED",
        account_id=acc_map["Zelle Toro Group"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=45.50,
        net_amount=45.50,
        sender_name="Toro Group LLC",
        receiver_name="Amazon / Personal",
        reference_id="AMZN-001",
        transaction_date=datetime.utcnow() - timedelta(hours=4)
    ))
    
    # H. Pago a Proveedor (Suministros)
    txs.append(Transaction(
        platform="BANESCO_VE",
        amount=2500.00,
        currency="VES",
        category="Gasto Operativo",
        transaction_type="SALIDA",
        status="COMPLETED",
        account_id=acc_map["Banesco P.Juridica"].id,
        session_id=session_open.id,
        exchange_rate=rate_ves,
        amount_usd=41.32,
        net_amount=2500.00,
        sender_name="Toro Group Vzla",
        receiver_name="Papeleria S.A.",
        reference_id="SUPPLIES-001",
        transaction_date=datetime.utcnow() - timedelta(hours=5)
    ))

    # I. Deuda a Pagar (Pasivo)
    txs.append(Transaction(
        platform="CASH",
        amount=100.00,
        currency="USD",
        category="Préstamo",
        transaction_type="ENTRADA",
        status="COMPLETED",
        account_id=acc_map["Caja Principal (Efectivo)"].id,
        session_id=session_open.id,
        exchange_rate=1.0,
        amount_usd=100.00,
        net_amount=100.00,
        sender_name="Prestamista Externo",
        receiver_name="Toro Group",
        reference_id="LOAN-IN-001",
        transaction_date=datetime.utcnow() - timedelta(days=1)
    ))

    db.add_all(txs)
    db.commit()
    
    print(f" Seeded {len(txs)} transactions successfully.")
    print(" Full data seed complete!")
    db.close()

if __name__ == "__main__":
    seed_full_data()
