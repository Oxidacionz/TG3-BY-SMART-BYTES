from typing import List
from fastapi import APIRouter, HTTPException
from src.transactions.domain.transaction import Transaction
from src.transactions.infrastructure.repository import transaction_repo

router = APIRouter()

@router.get("/", response_model=List[Transaction])
async def get_transactions():
    """
    Get all recent transactions.
    """
    return await transaction_repo.get_all()

@router.post("/", response_model=Transaction)
async def create_transaction(transaction: Transaction):
    """
    Create a new transaction manually or from scanner.
    """
    try:
        return await transaction_repo.save(transaction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/client/{client_id}", response_model=List[Transaction])
async def get_client_transactions(client_id: str):
    """
    Get transactions specific to a client (Ledger).
    """
    return await transaction_repo.get_by_client(client_id)
