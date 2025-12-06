from fastapi import APIRouter, HTTPException
from app.core.repository import repo
from typing import List, Dict, Any

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_transactions():
    return await repo.get_all_transactions()

@router.post("/", response_model=Dict[str, Any])
async def create_transaction(transaction: Dict[str, Any]):
    return await repo.save_transaction(transaction)
