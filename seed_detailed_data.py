import sys
import os
import uuid
import random
from datetime import datetime, timedelta

# Ensure backend path is in sys.path
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)

from app.core.database_sb import SessionLocal
from app.models.finance import Account, CashSession, AccountType
from app.models.transaction import Transaction

def create_random_date():
    days_ago = random.randint(0, 30)
    minutes_ago = random.randint(0, 1440)
    return datetime.utcnow() - timedelta(days=days_ago, minutes=minutes_ago)

def seed():
    db = SessionLocal()
    try:
        print("Starting detailed seed...")

        # 1. Accounts
        cash_account = db.query(Account).filter_by(name="Caja Principal USD").first()
        if not cash_account:
            print("Creating Main Cash Account...")
            cash_account = Account(name="Caja Principal USD", type=AccountType.CASH, currency="USD", current_balance=100000.00)
            db.add(cash_account)
            db.commit()
            db.refresh(cash_account)
        
        cash_id = cash_account.id

        # 2. Session
        session = db.query(CashSession).filter_by(status="OPEN").first()
        if not session:
            print("Creating Open Session...")
            session = CashSession(
                user_id="ADMIN", 
                branch_id="MAIN", 
                status="OPEN", 
                start_time=datetime.utcnow(),
                initial_balance=0.0,
                current_balance=0.0
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        
        session_id = session.id

        transactions_to_add = []

        # 3. Generate 20 Clients (Entradas)
        print("Generating 20 Clients...")
        clients = [f"Cliente {i}" for i in range(1, 21)]
        # Add some realistic names
        real_clients = ["Juan Perez", "Maria Garcia", "Inversiones ABC", "Comercial Norte", "Pedro Rodriguez", 
                       "Ana Martinez", "Luis Sanchez", "Carlos Gomez", "Laura Diaz", "Jorge Hernandez",
                       "Sofia Lopez", "Miguel Torres", "Elena Ramirez", "David Flores", "Carmen Rivera",
                       "Fernando Ruiz", "Isabel Morales", "Ricardo Castillo", "Patricia Velasquez", "Roberto Mendez"]
        
        for name in real_clients:
            # Create 2-4 transactions per client
            for _ in range(random.randint(2, 4)):
                amount = round(random.uniform(10.0, 500.0), 2)
                t_date = create_random_date()
                t = Transaction(
                    transaction_type="ENTRADA",
                    amount=amount,
                    currency="USD",
                    amount_usd=amount,
                    status="COMPLETED",
                    sender_name=name,
                    category="Venta",
                    transaction_date=t_date,
                    created_at=t_date,
                    account_id=cash_id,
                    session_id=session_id,
                    reference_id=f"REF-{random.randint(1000, 9999)}",
                    platform="CASH",
                    raw_text_snippet=f"Pago de servicio por {name}"
                )
                transactions_to_add.append(t)

        # 4. Generate 20 Providers (Salidas)
        print("Generating 20 Providers...")
        providers = [f"Proveedor {i}" for i in range(1, 21)]
        real_providers = ["Distribuidora Alimentos", "Servicios Tech", "Limpieza Total", "Seguridad 24/7", "Internet Veloz",
                          "Agua Pura", "Electricidad Corp", "Mantenimiento AC", "Papeleria Office", "Transporte Rápido",
                          "Constructora Solida", "Publicidad Creativa", "Abogados Asociados", "Contadores Express", "Seguros Confianza",
                          "Importadora Global", "Exportadora Local", "Ferretería Central", "Farmacia Salud", "Supermercado Ahorro"]

        for name in real_providers:
            # Create 1-3 transactions per provider
            for _ in range(random.randint(1, 3)):
                amount = round(random.uniform(50.0, 1000.0), 2)
                t_date = create_random_date()
                t = Transaction(
                    transaction_type="SALIDA",
                    amount=amount,
                    currency="USD",
                    amount_usd=amount,
                    status="COMPLETED",
                    receiver_name=name,
                    category="Gasto Operativo",
                    transaction_date=t_date,
                    created_at=t_date,
                    account_id=cash_id,
                    session_id=session_id,
                    reference_id=f"PAY-{random.randint(1000, 9999)}",
                    platform="CASH",
                    raw_text_snippet=f"Pago a proveedor {name}"
                )
                transactions_to_add.append(t)

        # 5. Generate 20 Workers (Salidas - Nomina)
        print("Generating 20 Workers...")
        workers = [f"Trabajador {i}" for i in range(1, 21)]
        real_workers = ["Empleado 1", "Empleado 2", "Jose Tecnico", "Maria Asistente", "Pedro Chofer",
                        "Ana Gerente", "Luis Vendedor", "Carlos Analista", "Laura Diseñadora", "Jorge Programador",
                        "Sofia RRHH", "Miguel Contador", "Elena Recepcionista", "David Mensajero", "Carmen Limpieza",
                        "Fernando Vigilante", "Isabel Cajera", "Ricardo Supervisor", "Patricia Coordinadora", "Roberto Director"]

        for name in real_workers:
            # Create 1-2 transactions per worker
            for _ in range(random.randint(1, 2)):
                amount = round(random.uniform(200.0, 800.0), 2)
                t_date = create_random_date()
                t = Transaction(
                    transaction_type="SALIDA",
                    amount=amount,
                    currency="USD",
                    amount_usd=amount,
                    status="COMPLETED",
                    receiver_name=name,
                    category="Pago Nomina",
                    transaction_date=t_date,
                    created_at=t_date,
                    account_id=cash_id,
                    session_id=session_id,
                    reference_id=f"NOM-{random.randint(1000, 9999)}",
                    platform="CASH",
                    raw_text_snippet=f"Pago de nómina a {name}"
                )
                transactions_to_add.append(t)

        print(f"Adding {len(transactions_to_add)} transactions to DB...")
        db.add_all(transactions_to_add)
        db.commit()
        print("[OK] Detailed seeding complete.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
