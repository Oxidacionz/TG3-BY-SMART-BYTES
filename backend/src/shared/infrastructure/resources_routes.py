from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Any, Dict

from app.core.database_sb import SessionLocal
from app.models.transaction import Transaction

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/clients")
async def get_clients_resources(db: Session = Depends(get_db)):
    """
    Get aggregated Stats for Clients and Providers.
    Returns: [{name, last, deals, volume, id}]
    """
    # 1. Clients (ENTRADA)
    clients_query = (
        db.query(
            Transaction.sender_name.label("name"),
            func.max(Transaction.transaction_date).label("last_date"),
            func.count(Transaction.id).label("deals"),
            func.sum(Transaction.amount_usd).label("volume")
        )
        .filter(Transaction.transaction_type == "ENTRADA")
        .filter(Transaction.sender_name.isnot(None))
        .group_by(Transaction.sender_name)
        .all()
    )

    # 2. Providers/Salidas (SALIDA)
    # Exclude those starting with "Trabajador" if we want to separate them, or keep them.
    # The user wanted "Clientes, Proveedores, Trabajadores".
    # Workers are likely in "operators" endpoint?
    # Or maybe merged here?
    # I'll put Clients and Providers here.
    
    providers_query = (
        db.query(
            Transaction.receiver_name.label("name"),
            func.max(Transaction.transaction_date).label("last_date"),
            func.count(Transaction.id).label("deals"),
            func.sum(Transaction.amount_usd).label("volume")
        )
        .filter(Transaction.transaction_type == "SALIDA")
        # Filter out workers if possible? Seeded names start with "Trabajador" or "Empleado"
        # Real naming strategy is better, but for now simple inclusion.
        .filter(Transaction.receiver_name.isnot(None))
        .group_by(Transaction.receiver_name)
        .all()
    )

    results = []
    
    # Process Clients
    for row in clients_query:
        import uuid
        results.append({
            "id": str(uuid.uuid4()), # Dynamic ID since we group by name
            "name": row.name,
            "type": "Client",
            "last": row.last_date.strftime("%Y-%m-%d %H:%M") if row.last_date else "N/A",
            "volume": f"{row.volume:.2f}",
            "deals": row.deals
        })

    # Process Providers
    for row in providers_query:
        import uuid
        # Check if it looks like a worker
        name_lower = row.name.lower()
        if "trabajador" in name_lower or "empleado" in name_lower or "nom-" in name_lower:
             continue # Skip workers here, assume they go to operators

        results.append({
            "id": str(uuid.uuid4()), 
            "name": row.name,
            "type": "Provider",
            "last": row.last_date.strftime("%Y-%m-%d %H:%M") if row.last_date else "N/A",
            "volume": f"{row.volume:.2f}",
            "deals": row.deals
        })

    return results

@router.get("/operators")
async def get_operators_resources(db: Session = Depends(get_db)):
    """
    Get aggregated Stats for Operators (Workers/Camellos).
    The View expects: {name, location, last, active, profit, volume}
    """
    # We will treat "Workers" (receiver of SALIDA with 'Nomina') as Operators for this view.
    # OR we can just fetch all 'SALIDA' where receiver_name is like 'Trabajador%'
    
    workers_query = (
        db.query(
            Transaction.receiver_name.label("name"),
            func.max(Transaction.transaction_date).label("last_date"),
            func.count(Transaction.id).label("deals"),
            func.sum(Transaction.amount_usd).label("volume")
        )
        .filter(Transaction.transaction_type == "SALIDA")
        .filter(Transaction.receiver_name.isnot(None))
        # Filter IN workers
        .filter(
            (Transaction.category == "Pago Nomina") | 
            (Transaction.receiver_name.like("Trabajador%")) |
            (Transaction.receiver_name.like("Empleado%"))
        )
        .group_by(Transaction.receiver_name)
        .all()
    )
    
    results = []
    for row in workers_query:
        import uuid
        results.append({
            "id": str(uuid.uuid4()),
            "name": row.name,
            "location": "Caracas, VE", # Placeholder
            "last": row.last_date.strftime("%Y-%m-%d %H:%M") if row.last_date else "Active Now",
            "active": True,
            "profit": "0.00", # Workers don't generate profit usually, but Cost. View expects Profit.
            "volume": f"{row.volume:.2f}"
        })
        
    return results
